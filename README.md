# 🍽️ Canteen Management System

A full-stack web application designed to streamline university canteen operations by digitizing food ordering, payments, and order management. It features role-based access control, real-time order tracking, and secure online payments.

### Detailed Overview
The Campus Canteen Management System is a robust MERN-stack solution (migrated to Supabase) that addresses common issues in college canteens such as long queues, manual cash handling, and order tracking inefficiencies.


The platform serves three primary roles:

1. Students/Staff: Can browse the menu, add items to a cart, place orders, and pay online or via cash.
2. Admins (Canteen Staff): Manage the food menu (add/edit/delete items), view incoming orders, accept/reject orders with reasons, and track payments.
3. Teachers/Staff: Enjoy specific privileges like room delivery options (based on role logic).
### Key Features
- Authentication & Security:
  
  - Secure Sign-Up/Sign-In using JWT (JSON Web Tokens).
  - Institutional Email Validation: Restricts registration to specific college domains (e.g., @sies.edu.in ).
  - Role-Based Access Control (RBAC): Distinct interfaces and permissions for Admins and Users (Students/Teachers).
- Order Management:
  
  - Digital Menu: Browse food items by category with images and prices.
  - Cart System: Add/remove items and view total cost dynamically.
  - Order Tracking: Real-time status updates (Pending → Accepted/Rejected → Paid → Completed).
  - Rejection Handling: Admins can provide specific reasons for rejecting an order (e.g., "Out of stock").
- Payments & Invoicing:
  
  - Razorpay Integration: Secure online payments via Credit/Debit Cards, UPI, and Wallets.
  - Cash on Delivery: Option to pay offline at the counter.
  - Automated Invoicing: Users can download PDF invoices for their orders (powered by jsPDF ).
- Feedback System:
  
  - Users can rate and review their food/experience after order completion.
### Tech Stack
Frontend:

- React.js: Component-based UI architecture.
- Redux: Global state management for auth, cart, and orders.
- CSS3: Custom responsive styling.
- Axios: HTTP client for API requests.
Backend:

- Node.js & Express.js: RESTful API architecture.
- Supabase (PostgreSQL): Primary database for storing users, orders, and food items.
- ImageKit: Cloud storage and optimization for food images.
Tools & Libraries:

- Razorpay: Payment Gateway.
- jsPDF: PDF generation for invoices.
- Vercel: Cloud deployment platform.
### How it Works
1. User Registration: Students sign up with their college email.
2. Ordering: Users select items, choose payment method (Online/Cash), and place an order.
3. Processing: Admin receives the order instantly on their dashboard. They verify availability and Accept or Reject the order.
4. Completion: User gets notified. If online payment is selected, they complete the transaction via Razorpay.
5. Record: Both Admin and User retain a history of the transaction and order details.