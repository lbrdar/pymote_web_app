from numpy import pi
from pymote import *
from pymote.environment import Environment2D
from pymote.algorithms.broadcast import Flood
from pymote.algorithms.readsensors import ReadSensors

def get_nodes(network):
    nodes = []
    for n in network.nodes():
        memory = {}
        for key in n.memory.keys():
            value = n.memory[key]
            if key == 'Neighbors':
                neighbors = []
                for neighbour in value:
                    neighbors.append(neighbour.id)
                memory[key] = neighbors
            else:
                memory[key] = value

        inbox = []
        for inMsg in n.inbox:
            inbox.append(str(inMsg))

        outbox = []
        for outMsg in n.inbox:
            outbox.append(str(outMsg))

        node = {
            'id': n.id,
            'x': network.pos[n][0],
            'y': network.pos[n][1],
            'theta': network.ori[n] * 180. / pi,
            'commRange': n.commRange,
            'status': n.status,
            'inbox': inbox,
            'outbox': outbox,
            'memory': memory
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

def get_network_dict(network):
    return {
        'nodes': get_nodes(network),
        'edges': get_edges(network),
        'settings': {
            'width': network.environment.im.shape[0],
            'height': network.environment.im.shape[1]
        }
    }

def generate_network(settings, nodes, edges, algorithmName):
    network = Network(environment=Environment2D(shape=(settings['width'], settings['height'])))
    if algorithmName == 'Flood':
        network.algorithms = ( (Flood, {'informationKey':'I'}), )
    elif algorithmName == 'ReadSensors':
        network.algorithms = ( (ReadSensors, {}), )

    for node in nodes:
        createdNode = network.add_node(pos=[node['x'], node['y']], ori=node['theta'], commRange=node['commRange'])
        memory = {}
        for k in node['memory'].keys():
            memory[k.encode('ascii', 'ignore')] = node['memory'][k].encode('ascii', 'ignore')
        createdNode.memory = memory

        # if network needs to be built with given edges, update ids
        if not settings['useCommRange']:
            for edge in edges:
                if edge[0]['id'] == node['id']:
                    edge[0]['id'] = createdNode.id
                elif edge[1]['id'] == node['id']:
                    edge[1]['id'] = createdNode.id


    if not settings['useCommRange']:
        network.remove_edges_from(network.edges())
        nodes = network.nodes()
        for edge in edges:
            key0 = next(k0 for k0 in nodes if k0.__repr__() == "<Node id=%s>" % edge[0]['id'])
            key1 = next(k1 for k1 in nodes if k1.__repr__() == "<Node id=%s>" % edge[1]['id'])
            if not network.adj[key0]:
                network.adj[key0] = {}
            network.adj[key0][key1] = {}
            if not network.adj[key1]:
                network.adj[key1] = {}
            network.adj[key1][key0] = {}

    return network