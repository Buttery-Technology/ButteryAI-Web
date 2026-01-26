import grpc
import uuid

import Node_pb2
import Node_pb2_grpc

from concurrent import futures
import time

NODES = []

class NodeService(Node_pb2_grpc.NodeServiceServicer):

    def GetAllNodes(self, request, context):
        cluster_id = request.cluster_id
        archived = request.archived

        filter_nodes = [
            node for node in NODES
            if node.cluster_id == request.cluster_id 
            and node.archived == request.archived
        ]
        
        return Node_pb2.NodeListReply(
            nodes = filter_nodes
        )

    def CreateNode(self, request, context):
        user_id = (
            context.invocation_metadata()[0].value
            if context.invocation_metadata() 
            else "anonymous"
        )

        if request.cluster_id =="":
            context.abort(
                grpc.StatusCode.INVALID_ARGUMENT,
                "cluster_id is required"
            )
        if request.name.strip()=="":
            context.abort(
                grpc.StatusCode.INVALID_ARGUMENT,
                "Please provide a Node name"
            )
        
        new_node = Node_pb2.Node(
            id = str(uuid.uuid4()),
            name = request.name,
            cluster_id = request.cluster_id,
            access = request.access,
            archived = False,
            grade = 0,
        )

        NODES.append(new_node)

        return Node_pb2.NodeReply(
            message = "Node was created",
            node = new_node
        )
    
    def GetNode(self, request, context):
        for node in NODES:
            if node.id == request.node_id:
                if node.cluster_id != request.cluster_id:
                    context.abort(
                        grpc.StatusCode.PERMISSION_DENIED,
                        "Node does not belong to this cluster"
                    )

                return Node_pb2.NodeReply(
                    message="Node retrieved successfully",
                    node = node
                )
        context.abort(
            grpc.StatusCode.NOT_FOUND,
            "Node not found"
        )
    
    def grade_to_colour(grade: int) -> str:
        if 60 <= grade <= 100:
            return "#22908C"
        elif 35 <= grade <= 59:
            return "#D12A89"
        elif 0 <= grade <= 34:
            return "#637684"
        else:
            return "#000000" 
    
    def UpdateNode(self, request, context):
      for node in NODES:
            if node.id == request.node_id: 
                node.name = request.name
                node.archived = request.archived 
                node.grade = request.grade

                return Node_pb2.NodeReply (
                    message = "Node was updated successfully",
                    node = node
                )
      else:
        context.abort(
        grpc.StatusCode.NOT_FOUND,
        "Node not found"
      )
      

    def DeleteNode(self, request, context):
        user_id = (
            context.invocation_metadata()[0].value 
            if context.invocation_metadata() 
            else "anonymous"
        )

        for i, node in enumerate(NODES):
            if node.id == request.node_id:
                if node.cluster_id != request.cluster_id:
                 context.abort(
                    grpc.StatusCode.PERMISSION_DENIED,
                    "Node does not belong to this cluster"
                )

                if request.permanent:
                    del NODES[i]
                    return Node_pb2.NodeReply(
                        message = "Node permanently deleted",
                        node = None
                    )
                else:
                    node.archived = True
                    return Node_pb2.NodeReply(
                        message = "Node was archived successfully",
                        node = node
                    )
        context.abort(
            grpc.StatusCode.NOT_FOUND,
            "Node not found"
        )

# testing the backend code
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    Node_pb2_grpc.add_NodeServiceServicer_to_server(NodeService(), server)
    
    server.add_insecure_port('[::]:50051')
    server.start()
    print("NodeService gRPC server started on port 50051...")
    
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)
        print("Server stopped")

if __name__ == "__main__":
    serve()