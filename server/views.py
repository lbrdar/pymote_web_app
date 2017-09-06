from django.views import View
from django.shortcuts import render
from django.middleware.csrf import get_token
from pymote import *
from pymote.algorithms.broadcast import Flood
from pymote.algorithms.niculescu2003.dvhop import DVHop
from pymote.algorithms.santoro2007.traversal import DFT, DFStar
from utils import get_network_dict, generate_network
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
                },
                {
                    'label': 'DFT',
                    'code': inspect.getsource(DFT),
                },
                {
                    'label': 'DFStar',
                    'code': inspect.getsource(DFStar),
                }
            ],
            'csrfmiddlewaretoken': str(get_token(request))
        }

        context = {
            'component': self.component,
            'props': props,
        }

        return render(request, self.template, context)


class Results(View):
    template = 'react_entrypoint.html'
    component = 'results'

    def post(self, request):
        data = json.loads(request.POST['data'])
        network = generate_network(data['settings'], data['nodes'], data['edges'], data['algorithm']['label'])
        simulation = Simulation(network)

        results = [get_network_dict(network)]
        while (network.algorithmState['finished'] == False):
            simulation.run_step()
            results.append(get_network_dict(network))


        props = {
            'results': results,
            'csrfmiddlewaretoken': str(get_token(request))
        }

        context = {
            'component': self.component,
            'props': props,
        }

        return render(request, self.template, context)