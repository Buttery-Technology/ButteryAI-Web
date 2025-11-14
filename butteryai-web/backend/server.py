from concurrent import futures
from datetime import datetime

import grpc

import backend.ServerStatus_pb2 as ServerStatus_pb2
import backend.ServerStatus_pb2_grpc as ServerStatus_pb2_grpc

import backend.RealTimeChat_pb2 as RealTimeChat_pb2
import backend.RealTimeChat_pb2_grpc as RealTimeChat_pb2_grpc

CHATS = []

class Chat(RealTimeChat_pb2_grpc.ChatServicer):
    def StartNew(self, request, context):
            new_chat = RealTimeChat_pb2.ChatObject(
                id = request.id,
                subject = request.subject,
                date = request.date,
                user = request.user,
                message = request.message
            )
            CHATS.append(new_chat)
            return RealTimeChat_pb2.ChatReply(id = request.id, message = "Message recieved", date = "6/12")
    
    def Get(self, request, context):
            return RealTimeChat_pb2.GetReply(ret = CHATS)
    
    def StreamUpdates(self, request_iterator, context):
            for request in request_iterator:
                inner = RealTimeChat_pb2.ChatObject()
                inner.ParseFromString(request.payload)

                yield RealTimeChat_pb2.StreamUpdate(
                    payload = request.payload,
                    timestamp = int(datetime.now().timestamp()),
                    received = True
                )

class Check(ServerStatus_pb2_grpc.CheckServicer):
    def checkStatus(self, request, context):
        return ServerStatus_pb2.StatusReply(message = True)
    
def serve():
    port = "50051"
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    RealTimeChat_pb2_grpc.add_ChatServicer_to_server(Chat(), server)
    ServerStatus_pb2_grpc.add_CheckServicer_to_server(Check(), server)
    server.add_insecure_port("[::]:" + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()
    
if __name__ == "__main__":
    serve()