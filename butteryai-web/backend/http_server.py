from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

import grpc
import Node_pb2
import Node_pb2_grpc

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


#app.add_middleware(
  # CORSMiddleware,
    #allow_origins=["http://localhost:5173"],
 #   allow_methods=["*"],
 #   allow_headers=["*"],
#)

GRPC_HOST = "localhost:50051"

def create_grpc_client():
    channel = grpc.insecure_channel(GRPC_HOST)
    stub = Node_pb2_grpc.NodeServiceStub(channel)
    return stub

class NodeCreateRequest(BaseModel):
    name: str
    access: str

@app.post("/clusters/{cluster_id}/nodes")
def create_node(cluster_id: str, node: NodeCreateRequest):
    stub = create_grpc_client()

    access_map = {
        "PUBLIC": Node_pb2.PUBLIC,
        "PRIVATE": Node_pb2.PRIVATE,
    }

    try:
        grpc_request = Node_pb2.CreateNodeRequest(
            name = node.name,
            cluster_id = cluster_id,
            access = access_map.get(
                node.access,
                Node_pb2.ACCESS_UNSPECIFIED
            ),
        )
        response = stub.CreateNode(grpc_request)
         
        return {
            "message": response.message,
            "node": {
                "id": response.node.id,
                "name": response.node.name,
                "cluster_id": response.node.cluster_id,
                "access": response.node.access,
                "archived": response.node.archived,
                "grade": response.node.grade,
            }
        }
    except grpc.RpcError as e:
        raise HTTPException(status_code = 400, detail=e.details())
