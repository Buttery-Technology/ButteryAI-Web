import grpc
import backend.ServerStatus_pb2 as ServerStatus_pb2
import backend.ServerStatus_pb2_grpc as ServerStatus_pb2_grpc

import backend.RealTimeChat_pb2 as RealTimeChat_pb2
import backend.RealTimeChat_pb2_grpc as RealTimeChat_pb2_grpc
from datetime import datetime

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        # stubs
        Check_Stub = ServerStatus_pb2_grpc.CheckStub(channel)
        Chat_Stub = RealTimeChat_pb2_grpc.ChatStub(channel)
        
        while True:
            # input (user's interface)
            FunctionCall = input("Enter a function to call (0 to break): ")

            # Check if server is up
            if FunctionCall == "1":
                try:
                    responseOne = Check_Stub.checkStatus(ServerStatus_pb2.StatusRequest())
                    if responseOne.message:
                        print("Server is up and healthy")
                    else:
                        print("Server is up but unhealthy")
                except grpc.RpcError as e: 
                    if e.code() == grpc.StatusCode.UNAVAILABLE:
                        print("Server is down")
                    else:
                        print("gRPC error")
            
            # Make object
            elif FunctionCall == "2":
                request = RealTimeChat_pb2.ChatObject(
                        id = "1",
                        subject = "test", 
                        date = "6/12", 
                        user = "A", 
                        message = "B"
                )
                responseTwo = Chat_Stub.StartNew(request)
                print(responseTwo.message)

                request = RealTimeChat_pb2.ChatObject(
                        id = "2",
                        subject = "test 2", 
                        date = "6/18", 
                        user = "C", 
                        message = "D"
                )
                responseFour = Chat_Stub.StartNew(request)
                print(responseFour.message)
            
            # Get chats stored
            elif FunctionCall == "3":
                responseThree = Chat_Stub.Get(RealTimeChat_pb2.GetRequest())
                for chat in responseThree.ret:
                    print(f"ID: {chat.id}, Subject: {chat.subject}, User: {chat.user}, Message: {chat.message}, Date: {chat.date}")
            
            # Stream updates (I don't know what this specifically does)
            elif FunctionCall == "4":
                serialized_bytes = request.SerializeToString()
                req = RealTimeChat_pb2.StreamRequest(
                        id = "1",
                        payload = serialized_bytes
                )
                response_stream = Chat_Stub.StreamUpdates(iter([req]))
                for response in response_stream:
                    print(response.received)
            
            # break loop
            elif FunctionCall == "0":
                break

if __name__ == "__main__":
    run()
