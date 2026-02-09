export const getWelcomeEmailTemplate = (username) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #4A90E2; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .content h2 { color: #4A90E2; margin-top: 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4A90E2; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
          .footer { background-color: #333; color: #fff; text-align: center; padding: 15px; font-size: 12px; }
          .footer a { color: #4A90E2; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to HackNext!</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>We are thrilled to have you on board! Your account has been successfully created.</p>
            <p>At HackNext, we strive to bring you the best events and hackathons. Explore the platform and start your journey.</p>
            <a href="https://hacknext-plum.vercel.app/user/allevents" class="button">Go to Dashboard</a>
            <p style="margin-top: 30px; font-size: 0.9em; color: #666;">If you have any questions, feel free to reply to this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} HackNext. All rights reserved.</p>
            <p>You received this email because you signed up on our platform.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

export const getSuccessEmailTemplate = (username, actionDetails) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #2ECC71; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .content h2 { color: #2ECC71; margin-top: 0; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #2ECC71; padding: 15px; margin: 20px 0; }
          .footer { background-color: #333; color: #fff; text-align: center; padding: 15px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Success!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username},</h2>
            <p>Great news! Your recent action was completed successfully.</p>
            
            <div class="details-box">
              <p><strong>Action:</strong> ${actionDetails.title}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              ${actionDetails.extraInfo ? `<p>${actionDetails.extraInfo}</p>` : ''}
            </div>
  
            <p>We look forward to seeing you at the event!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} HackNext. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

export const getOtpEmailTemplate = (username, otp) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #6C5CE7; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .otp-code { display: inline-block; padding: 15px 30px; background-color: #f0f0f0; color: #333; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0; border: 2px dashed #6C5CE7; }
          .footer { background-color: #333; color: #fff; text-align: center; padding: 15px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${username},</h2>
            <p>You requested to reset your password. Use the OTP below to proceed.</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} HackNext. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

export const getEventAppliedEmailTemplate = (username, event) => {
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date) => {
    return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const startDate = formatDate(event.StartDate);
  const endDate = formatDate(event.EndDate);

  // Construct Google Calendar URL
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.EventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.EventDescription)}&location=${encodeURIComponent(event.Venue + ", " + event.City)}`;

  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #8E44AD; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .content h2 { color: #8E44AD; margin-top: 0; }
          .event-card { background-color: #f3e5f5; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e1bee7; }
          .event-card h3 { margin-top: 0; color: #4a148c; }
          .event-info { margin-bottom: 10px; font-size: 14px; }
          .calendar-btn { display: inline-block; padding: 12px 24px; background-color: #8E44AD; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; text-align: center; }
          .footer { background-color: #333; color: #fff; text-align: center; padding: 15px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Successful!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username},</h2>
            <p>You have successfully applied for <strong>${event.EventTitle}</strong>.</p>
            
            <div class="event-card">
              <h3>${event.EventTitle}</h3>
              <div class="event-info"><strong>📅 Date:</strong> ${new Date(event.StartDate).toLocaleDateString()} - ${new Date(event.EndDate).toLocaleDateString()}</div>
              <div class="event-info"><strong>📍 Venue:</strong> ${event.Venue}, ${event.City}</div>
              <div class="event-info"><strong>🏢 Organization:</strong> ${event.OrganisationName}</div>
            </div>

            <p>Don't miss out! Add this event to your calendar now.</p>
            
            <center>
                <a href="${googleCalendarUrl}" target="_blank" class="calendar-btn">📅 Add to Google Calendar</a>
            </center>

            <p style="margin-top: 30px;">Good luck with the event! We'll keep you posted on any updates.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} HackNext. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
