from numpy import pi

def get_nodes(network):
    nodes = []
    for n in network.nodes():
        node = {
            'id': n.id,
            'x': network.pos[n][0],
            'y': network.pos[n][1],
            'theta': network.ori[n] * 180. / pi,
            'memory': n.memory
        }
        nodes.append(node)
    return nodes

def get_edges(network):
    edges = []
    for e in network.edges():
        n0 = e[0];
        n1 = e[1];
        edge = [{
            'id': n0.id,
            'x': network.pos[n0][0],
            'y': network.pos[n0][1],
        }, {
            'id': n1.id,
            'x': network.pos[n1][0],
            'y': network.pos[n1][1],
        }]
        edges.append(edge)
    return edges