from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Student
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import logout as auth_logout
from .questions import quiz
import json
import secrets

def generate_token():
    return secrets.token_urlsafe(16)  # generate a 16-character token

def index(request):
    if request.method == 'POST':
        image = request.FILES.get('image')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if Student.objects.filter(username=username).exists():
            return JsonResponse({'message': 'account with this username already exist', 'type': 'username_error'} , status=409)

        if Student.objects.filter(email=email).exists():
            return JsonResponse({'message': 'account with this email already exist ', 'type': 'email_error'}, status=409)

        new_student = Student.objects.create(
            image = image,
            username = username,
            email = email,
            password=make_password(password),  # Hash the password,
            score=0
        )
        if image:
            new_student.image.save(image.name, image)
        new_student.save()
        return JsonResponse({'message': 'form submitted successfully'}, status=200)
    else:
        return render(request, 'index.html')  # Assuming you have an index.html template

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = Student.objects.filter(username=username).first()
        if user:
            if check_password(password, user.password):
                request.session['student_id'] = user.id
            else:
                return JsonResponse({'message': 'Incorrect password', 'type': 'password_error'}, status=401);
        else:
            return JsonResponse({'message': 'User not found', 'type': 'username_error'}, status=404)

    return render(request, 'login.html')

def get_initial_question(request):
    # Assuming you have a model for questions (e.g., quiz)
    # Fetch the first question from your database
    initial_question = quiz[0]

    # Convert the question data to JSON
    question_data = {
        'id': initial_question['id'],
        'question': initial_question['question'],
        'options': initial_question['options'],
        'type': initial_question['type']
    }

    return JsonResponse(question_data)


def get_next_question(request):
    current_question_index = request.session.get('current_question_index', 0)
    next_question_index = current_question_index + 1

    if next_question_index < len(quiz):
        request.session['current_question_index'] = next_question_index
        next_question = quiz[next_question_index]
        return JsonResponse({
            'next_question': {
                'id': next_question['id'],
                'question': next_question['question'],
                'options': next_question['options'],
                'type': next_question['type']
            },
            'status': 'ongoing'
        })
    else:
        token = generate_token()  # Generate unique ID
        request.session['session_id'] = token  # Store the session ID
        response = JsonResponse({'status': 'finished'})
        return response 

def process_answer(request, user):
    if request.content_type == 'application/json':
        data = json.loads(request.body.decode('utf-8'))
        selected_answer = data.get('answer')

        current_question_index = request.session.get('current_question_index', 0)
        current_question = quiz[current_question_index]


        if selected_answer == current_question.get('answer'):
            user.score += 10
            user.answer_correct += 1
            user.save()

            if user.score >= 40:
                user.percentage = 100
                user.remark = "Excellent"
            elif user.score >= 30:
                user.percentage = 75
                user.remark = "Very Good"
            elif user.score >= 20:
                user.percentage = 50
                user.remark = "Good"
            else:
                user.percentage = 25
                user.remark = "Failed"
            
            if user.score == 40:
                 user.grade = "A"
            elif user.score == 30:
                 user.grade = "B"
            elif user.score == 20:
                user.grade = "C"
            else:
                user.grade = "D"

            user.save()

        return get_next_question(request)
    else:
        return JsonResponse({'message': 'Invalid request data'}, status=400)

def test(request):
    if 'student_id' not in request.session:
        return redirect('login')  # Redirect to login if not logged in
    user = Student.objects.get(pk=request.session['student_id'])
    

    if request.method == 'POST':
        return process_answer(request, user)
    else:
        context = {
            'user': user, 
            'question_length' : len(quiz)
        }
    return render(request, 'test.html', context)

def get_session_id(request):
    session_id = request.session.get('session_id')
    return JsonResponse({'session_id': session_id})

def logout_view(request):
    """Logs out the user and clears session data."""
    auth_logout(request)
    request.session.flush()  # Clear all session data
    return redirect('login')  # Redirect to login page or any other desired page
