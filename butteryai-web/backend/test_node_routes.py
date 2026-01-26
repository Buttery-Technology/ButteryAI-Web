import grpc
import Node_pb2
import Node_pb2_grpc

def run():
    channel = grpc.insecure_channel("localhost:50051")
    stub = Node_pb2_grpc.NodeServiceStub(channel)

    metadata = (("user_id", "test-user"),)

    #create
    create_response = stub.CreateNode(
        Node_pb2.CreateNodeRequest(
            name="Test Node",
            cluster_id="cluster-123",
            access=Node_pb2.PRIVATE
        ),
        metadata=(("user_id", "user-abc"),)
        )

    print("CREATE NODE:", create_response.message)
    node_id = create_response.node.id

    #get all
    all_nodes = stub.GetAllNodes(
        Node_pb2.GetAllNodesRequest(
            cluster_id = "cluster-123",
            archived = False
        )
    )
    print("\nGET ALL NODES:", [node.name for node in all_nodes.nodes])

    #get
    get_node = stub.GetNode(
        Node_pb2.GetNodeRequest(
            cluster_id = "cluster-123",
            node_id = node_id
        )
    )
    print("\nGET ONE NODE:", get_node.node.name, "| ID:", get_node.node.id)

    #update
    update_response = stub.UpdateNode(
        Node_pb2.UpdateNodeRequest(
            cluster_id = "cluster-123",
            node_id = node_id,
            name = "Updated Node Name",
            archived = False,
            grade = 85
        ),
        metadata = metadata
    )
    print("\nUPDATE NODE:", update_response.message)

    #confirm the node updates
    get_node_after_update = stub.GetNode(
        Node_pb2.GetNodeRequest(
            cluster_id = "cluster-123",
            node_id = node_id
        )
    )
    print("Updated Node Name:", get_node_after_update.node.name, "| Grade:", get_node_after_update.node.grade)

    #delete 
    delete_response = stub.DeleteNode(
        Node_pb2.DeleteNodeRequest(
            cluster_id = "cluster-123",
            node_id = node_id,
            permanent = False
        ),
        metadata=metadata
    )
    print("\nDELETE NODE (archived):", delete_response.message)

    #check if node was deleted 
    all_nodes_after_delete = stub.GetAllNodes(
        Node_pb2.GetAllNodesRequest(
            cluster_id = "cluster-123",
            archived = False
        )
    )
    print("Nodes after delete:", [node.name for node in all_nodes_after_delete.nodes])

if __name__ == "__main__":
    run()
