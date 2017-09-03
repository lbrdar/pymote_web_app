from django.views import View
from django.shortcuts import render
from django.middleware.csrf import get_token
from pymote import *
from pymote.algorithms.broadcast import Flood
from pymote.algorithms.readsensors import ReadSensors
from utils import get_network_dict, generate_network
import inspect
import json

class Algorithm(View):
    template = 'react_entrypoint.html'
    component = 'algorithm'
    network = NetworkGenerator(4).generate_random_network()

    def get(self, request):
        # gets passed to react via window.props
        props = {
            'algorithms': [
                {
                    'label': 'Flood',
                    'code': inspect.getsource(Flood),
                },
                {
                    'label': 'ReadSensors',
                    'code': inspect.getsource(ReadSensors),
                }
            ],
            'network': get_network_dict(self.network),
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
        network = generate_network(data['nodes'], data['algorithm']['label'])
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