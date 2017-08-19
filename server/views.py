from django.views import View
from django.shortcuts import render
from pymote import *
from pymote.algorithms.broadcast import Flood
from numpy import pi
import inspect

class Algorithm(View):
    template = 'react_entrypoint.html'
    component = 'algorithm'
    network = NetworkGenerator(100).generate_random_network()

    def get_nodes(self, network):
        nodes = []
        for n in network.nodes():
            node = {
                'x': network.pos[n][0],
                'y': network.pos[n][1],
                'theta': network.ori[n] * 180. / pi
            }
            nodes.append(node)
        return nodes

    def get_edges(self, network):
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

    def get_network_dict(self, network):
        return {
            'nodes': self.get_nodes(network),
            'edges': self.get_edges(network),
        }

    def get(self, request):
        # gets passed to react via window.props
        props = {
            'algorithm': inspect.getsource(Flood),
            'network': self.get_network_dict(self.network)
        }

        context = {
            'component': self.component,
            'props': props,
        }

        return render(request, self.template, context)