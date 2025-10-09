from django import forms
from .models import User

class LoginForm(forms.Form):
    email = forms.EmailField(label='Email')
    password = forms.CharField(label='Password', widget=forms.PasswordInput)


class SignUpForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)
    role = forms.ChoiceField(
        choices=[('student', 'Student'), ('organizer', 'Organizer')],
        widget=forms.RadioSelect
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'role')

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get('password1') != cleaned_data.get('password2'):
            self.add_error('password2', "Passwords do not match")
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        # Organizer must be approved by Admin later
        user.is_approved = (self.cleaned_data['role'] == 'student')
        if commit:
            user.save()
        return user
