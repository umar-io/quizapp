from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('login/', views.login, name='login'),
    path('test/', views.test, name='test'),
    path('get_session_id/', views.get_session_id),
    path('get_initial_question/', views.get_initial_question,),
    path('logout/', views.logout_view, name='logout'),
]
