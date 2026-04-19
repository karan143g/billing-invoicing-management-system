# Billing & Invoicing Management System

A full-stack **Billing & Invoicing web application** built using **Angular**, **ASP.NET Core Minimal API**, and **SQL Server**.  
This project is designed to manage products, customers, invoices, authentication, and role-based access in a clean and scalable architecture.

---

## 🚀 Tech Stack

### Frontend
- Angular
- TypeScript
- Angular Material
- RxJS
- HTML / SCSS

### Backend
- ASP.NET Core 8 Minimal API
- C#
- AutoMapper
- JWT Authentication
- BCrypt Password Hashing

### Database
- SQL Server
- Stored Procedures
- Tables / Relational Schema

### Tools
- Visual Studio 2022
- VS Code
- Swagger
- Git / GitHub

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT Token based login
- Role-based access control (Admin / User / Manager)
- Secure password hashing using BCrypt
- Protected API endpoints
- Route guards & interceptor in Angular

### 📦 Product Management
- Add / Edit / Delete Products
- Product pricing & GST %
- Active / Inactive status

### 👥 Customer Management
- Add / Edit / Delete Customers
- Contact details management

### 🧾 Invoice Management
- Create invoice with multiple items
- Auto invoice number generation
- GST calculation
- Subtotal / Grand total calculation
- Duplicate product merge logic
- Invoice listing with filters
- Invoice detail view
- Export invoice as PDF

### 🎨 UI / UX
- Responsive layout
- Header + Sidebar navigation
- Login page with branding
- Angular Material dialogs
- Snackbar notifications
- Loading spinners

⚙️ Setup Instructions
### 1️⃣ Clone Repository
git clone https://github.com/karan143g/billing-invoicing-management-system

### 2️⃣ Database Setup
- Create SQL Server database
- Run the `BillingSystem_SQL_Scripts.sql` file
- Verify sample seed data is inserted successfully
- Update connection string in: **appsettings.json**

🔑 Demo Credentials

**Admin Login**
- Username: admin
- Password: admin123

**User Login**
- Username: user
- Password: user123
