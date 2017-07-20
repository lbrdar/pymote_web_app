from django.views.generic import View
from django.shortcuts import render


class Algorithm(View):
    title = 'Algorithm'
    template = 'react_entrypoint.html'
    component = 'algorithm'

    def get(self, request):
        # gets passed to react via window.props
        props = {
            'title': self.title
        }

        context = {
            'title': self.title,
            'component': self.component,
            'props': props,
        }

        return render(request, self.template, context)