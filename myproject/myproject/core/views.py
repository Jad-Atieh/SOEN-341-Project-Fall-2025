from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .forms import LoginForm
from .models import User  # Adjust the import path if needed

def login_view(request):
    error = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                login(request, user)
                if user.role == User.STUDENT:
                    return redirect('/events/')
                elif user.role == User.ORGANIZER:
                    return redirect('/organizer/dashboard/')
                elif user.role == User.ADMIN:
                    return redirect('/admin/dashboard/')
                else:
                    return redirect('/')
            else:
                error = "Invalid credentials or not approved."
    else:
        form = LoginForm()
    return render(request, 'core/login.html', {'form': form, 'error': error})
