import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

import { MaterialModule } from '../../../shared/material/material-module';
import { User } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login-callback-component',
  imports: [
    MaterialModule
  ],
  templateUrl: './login-callback-component.html',
  styleUrl: './login-callback-component.scss',
})
export class LoginCallbackComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    // 1. Capture the query params sent by the .NET Backend
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userJson = params['user'];
      const error = params['error'];

      if (token && userJson) {
        try {
          // 2. Decode the User object, Parse the Raw JSON (It has keys like 'DisplayName', 'Email')
          const rawUser = JSON.parse(decodeURIComponent(userJson));

          // 3. Manual Map to ensure camelCase for TypeScript
          const user: User = {
            id: rawUser.Id,
            email: rawUser.Email,
            displayName: rawUser.DisplayName, // Map DisplayName -> displayName
            profileImageUrl: rawUser.ProfileImageUrl,
            phoneNumber: rawUser.PhoneNumber,
            createdOn: rawUser.CreatedOn
          };
          
          // 4. Log the user in using AuthService
          this.authService.setExternalSession(token, user);

          // 5. Redirect to home or shop
          this.router.navigate(['/']);
        } catch (e) {
          console.error('Error parsing external login data', e);
          this.router.navigate(['/auth/login']);
        }
      } else {
        // Handle failure
        console.error('External login failed', error);
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
