


from hashlib import sha256
import json
import time

from flask import Flask, request
import requests
import psycopg2
import hashlib
import os



def hashthis(st):
    

    hash_object = hashlib.md5(st.encode())
    h = str(hash_object.hexdigest())
    return h


def connector():
    # cockroachstring = "dbname='wet-dingo-838.defaultdb' user='muntaser' password='redacted' host='free-tier.gcp-us-central1.cockroachlabs.cloud' port='26257'"
    cockroachstring = os.environ.get('COCKROACHSTR')
    conn=psycopg2.connect(cockroachstring)
    return conn

def addincident(conn, address, typ, desc, date, userid):
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM incidents")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        i = 1
        for row in rows:
            i = i + 1
        i = str(i)
        
        cur.execute("UPSERT INTO incidents (id, userid, address, type, description, date) VALUES (" + i +", '" + userid + "', '" + address + "', '" + typ + "', '" + desc + "', '" + date +"')")
        # logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()

    istr = userid + ":" + typ + ":" + date  + ":" + address

    h = hashthis(istr)
    return i, istr, h

def loadchain(conn, blockchain, eid):
    

    chain_data = []

    for block in blockchain.chain:
        chain_data.append(block.__dict__)

    chain = str(json.dumps(chain_data))

    # print(chain)

    with conn.cursor() as cur:
        cur.execute("SELECT id, chain, FROM chains")
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        i = 1
        for row in rows:
            i = i + 1
            if row[0] == eid:
                found = 1
                chainstr = row[1]
                chain = []
                chain_data = json.loads(chainstr)
                for c in chain_data:
                    b = Block(c["index"], c["transactions"], c["timestamp"], c["previous_hash"], c["data"])
                    b.hash = c['hash'] 
                    chain.append(b)
                
            # print(chain)
            blockchain.load_chain(chain)
        i = str(i)
        return blockchain

    
    return blockchain

class Block:
    def __init__(self, index, transactions, timestamp, previous_hash, data):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = 0
        self.data = data

    def compute_hash(self):
        """
        A function that return the hash of the block contents.
        """
        block_string = json.dumps(self.__dict__, sort_keys=True)
        return sha256(block_string.encode()).hexdigest()


class Blockchain:
    # difficulty of our PoW algorithm
    difficulty = 2

    def __init__(self):
        self.unconfirmed_transactions = []
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        """
        A function to generate genesis block and appends it to
        the chain. The block has index 0, previous_hash as 0, and
        a valid hash.
        """
        genesis_block = Block(0, [], time.time(), "0", "SEACUREVOTING")
        genesis_block.hash = genesis_block.compute_hash()
        self.chain.append(genesis_block)
    
    def load_chain(self, oldchain):
        self.chain =[]
        self.chain = oldchain

    @property
    def last_block(self):
        return self.chain[-1]

    def add_block(self, block, proof):
        """
        A function that adds the block to the chain after verification.
        Verification includes:
        * Checking if the proof is valid.
        * The previous_hash referred in the block and the hash of latest block
          in the chain match.
        """
        previous_hash = self.last_block.hash

        if previous_hash != block.previous_hash:
            return False

        if not self.is_valid_proof(block, proof):
            return False

        block.hash = proof
        self.chain.append(block)
        return True

    def is_valid_proof(self, block, block_hash):
        """
        Check if block_hash is valid hash of block and satisfies
        the difficulty criteria.
        """
        return (block_hash.startswith('0' * Blockchain.difficulty) and
                block_hash == block.compute_hash())

    def proof_of_work(self, block):
        """
        Function that tries different values of nonce to get a hash
        that satisfies our difficulty criteria.
        """
        block.nonce = 0

        computed_hash = block.compute_hash()
        while not computed_hash.startswith('0' * Blockchain.difficulty):
            block.nonce += 1
            computed_hash = block.compute_hash()

        return computed_hash

    def add_new_transaction(self, transaction):
        self.unconfirmed_transactions.append(transaction)

    def mine(self, data):
        """
        This function serves as an interface to add the pending
        transactions to the blockchain by adding them to the block
        and figuring out Proof Of Work.
        """
        if not self.unconfirmed_transactions:
            return False

        last_block = self.last_block

        new_block = Block(index=last_block.index + 1,
                          transactions=self.unconfirmed_transactions,
                          timestamp=time.time(),
                          previous_hash=last_block.hash,
                          data = data)

        proof = self.proof_of_work(new_block)
        self.add_block(new_block, proof)

        self.unconfirmed_transactions = []
        return new_block.index


app = Flask(__name__)
blockchain = Blockchain()

@app.route('/chain', methods=['GET'])
def get_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append(block.__dict__)
    return json.dumps({"length": len(chain_data),
                       "chain": chain_data})


@app.route('/add2chain', methods=['POST'])
def add_to_chain():
    req = request.get_json()
    print (req)

    incident = {}
    incident['address'] = req['address']
    incident['type'] = req['type']
    incident['description'] = req['description']
    incident['date'] = req['date']
    incident['userid'] = req['uid']
    
    istr = json.dumps(incident)
    # votestr = req['vote']
    # votehash = req['hash']


    # transaction = votestr + ":" + votehash

    transaction = istr

    blockchain.add_new_transaction(transaction)

    id = blockchain.mine(req['type'])


    return json.dumps({"incidentblockid": str(id)})

    # return json.dumps(chain_data)



app.run(host = '45.79.199.42', debug=True, port=8000)

