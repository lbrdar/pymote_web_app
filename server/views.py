from django.views import View
from django.shortcuts import render
from pymote import *
from pymote.algorithms.broadcast import Flood
from pymote.algorithms.readsensors import ReadSensors
from utils import get_nodes, get_edges
import inspect

class Algorithm(View):
    template = 'react_entrypoint.html'
    component = 'algorithm'
    network = NetworkGenerator(100).generate_random_network()

    def get_network_dict(self, network):
        return {
            'nodes': get_nodes(network),
            'edges': get_edges(network),
        }

    def get(self, request):
        # gets passed to react via window.props
        props = {
            'algorithm': {
                'label': 'Flood',
                'code': inspect.getsource(Flood),
            },
            'algorithm2': {
                'label': 'ReadSensors',
                'code': inspect.getsource(ReadSensors),
            },
            'network': self.get_network_dict(self.network)
        }

        context = {
            'component': self.component,
            'props': props,
        }

        return render(request, self.template, context)