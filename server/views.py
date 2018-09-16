from math import floor
from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from pymote import *
from pymote.algorithms.broadcast import Flood
from pymote.algorithms.niculescu2003.dvhop import DVHop
# from pymote.algorithms.santoro2007.traversal import DFT, DFStar

from utils import get_network_dict, generate_network, generate_graph
import networkx as nx
import inspect
import json

class Algorithm(View):
    template = 'react_entrypoint.html'
    component = 'algorithm'

    def get(self, request):
        # gets passed to react via window.props
        props = {
            'algorithms': [
                {
                    'label': 'Flood',
                    'code': inspect.getsource(Flood),
                },
                {
                    'label': 'DVHop',
                    'code': inspect.getsource(DVHop),
                }
                # {
                #     'label': 'DFT',
                #     'code': inspect.getsource(DFT),
                # },
                # {
                #     'label': 'DFStar',
                #     'code': inspect.getsource(DFStar),
                # }
            ],
            'csrfmiddlewaretoken': str(get_token(request))
        }

        context = {
            'component': self.component,
            'props': props,
        }

        return render(request, self.template, context)


class Results(View):
    def post(self, request):
        data = json.loads(request.POST['data'])
        network = generate_network(data['settings'], data['nodes'], data['edges'], data['algorithm'])
        simulation = Simulation(network)

        results = [get_network_dict(network)]
        if len(network.algorithms) > 0:
            while (network.algorithmState['finished'] == False):
                simulation.run_step()
                results.append(get_network_dict(network))

        return JsonResponse(results, safe=False);

class CreateNetwork(View):
    def get(self, request):
        networkType = request.GET.get('networkType', 'random')
        numOfNodes = int(request.GET.get('numOfNodes', '10'))
        settings = request.GET.get('settings', None)
        if settings:
            settings = json.loads(settings)
        else:
            settings = {
                'width': 600,
                'height': 600,
                'defaultTheta': 0,
                'defaultCommRange': 100,
                'useCommRange': False
            }

        graph = generate_graph(networkType, numOfNodes)
        pos = nx.spring_layout(graph)
        nx.set_node_attributes(graph, 'pos', pos)

        nodes = []
        for n in graph.nodes(data=True):

            x = floor(settings['width'] * n[1]['pos'][0])
            y = floor(settings['height'] * n[1]['pos'][1])
            if x <= 0.: x = 1.
            if x >= settings['width']: x -= 1.
            if y <= 0.: y = 1.
            if y >= settings['height']: y -= 1.


            nodes.append({
                'id': n[0],
                'x': x,
                'y': y,
                'theta': settings['defaultTheta'],
                'commRange': settings['defaultCommRange'],
                'memory': {}
            })

        edges = []
        for e in graph.edges():
            edges.append([
                {
                    'id': e[0]
                }, {
                    'id': e[1]
                }
            ])
        network = generate_network(settings, nodes, edges)
        return JsonResponse(get_network_dict(network))
