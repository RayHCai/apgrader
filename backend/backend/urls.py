from django.contrib import admin
from django.urls import path

from assignments.views import AssignmentView, StudentResponseView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("assignments/", AssignmentView.as_view()),
    path("grade/", StudentResponseView.as_view()),
]
