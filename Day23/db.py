from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb+srv://admin:1h0nsSX56UqiOXOk@cluster0.lbfiong.mongodb.net/admin?retryWrites=true&loadBalanced=false&replicaSet=atlas-rrxn6n-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1")
print("Connected to MongoDB")

db = client["market_place"]