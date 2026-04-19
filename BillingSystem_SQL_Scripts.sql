-- =============================================
-- Billing & Invoicing Management System SQL Scripts
-- Includes: Database, Tables, Seed Data, Stored Procedures
-- =============================================

-- CREATE DATABASE (optional)
-- CREATE DATABASE BillingDB;
-- GO
-- USE BillingDB;
-- GO

-- =============================================
-- TABLES
-- =============================================
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(200) NOT NULL,
    Role NVARCHAR(30) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(150) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    GstPercent DECIMAL(5,2) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Customers (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName NVARCHAR(150) NOT NULL,
    Phone NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    AddressLine NVARCHAR(250) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE InvoiceHeader (
    InvoiceId INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceNo NVARCHAR(30) NOT NULL UNIQUE,
    InvoiceDate DATE NOT NULL,
    CustomerId INT NOT NULL,
    SubTotal DECIMAL(18,2) NOT NULL,
    GstTotal DECIMAL(18,2) NOT NULL,
    GrandTotal DECIMAL(18,2) NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_InvoiceHeader_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
);
GO

CREATE TABLE InvoiceItems (
    ItemId INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceId INT NOT NULL,
    ProductId INT NOT NULL,
    Qty INT NOT NULL,
    Rate DECIMAL(18,2) NOT NULL,
    GstPercent DECIMAL(5,2) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    GstAmount DECIMAL(18,2) NOT NULL,
    Total DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_InvoiceItems_Header FOREIGN KEY (InvoiceId) REFERENCES InvoiceHeader(InvoiceId),
    CONSTRAINT FK_InvoiceItems_Product FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);
GO

-- =============================================
-- SEED DATA (replace hashes with real BCrypt hashes if needed)
-- =============================================
INSERT INTO Users (Username, PasswordHash, Role) VALUES
('admin', '$2a$11$wUXZMf9BrR8Cr/CVLxVNJ.gm0BEq4G7GK.lDO9kysJAFpN21mm5za', 'Admin'),
('manager', '$2a$11$EHZe/2Y0ErrKvZOG5R1QDesjK/nzseM6TfWrhqLwu/h6nCKMv0iP.', 'Manager'),
('user', '$2a$11$WBiHIiy77/wVIhoayYRnrecp/9FwJktaxNKIdTjU1Sq8n0QriNAtK', 'User');
GO

INSERT INTO Products (ProductName, Price, GstPercent) VALUES
('Laptop', 55000, 18),
('Keyboard', 1200, 18),
('Mouse', 700, 18),
('Printer', 9000, 18);
GO

INSERT INTO Customers (CustomerName, Phone, Email, AddressLine) VALUES
('Arun Kumar', '9876543210', 'arun@test.com', 'Chennai'),
('Priya S', '9123456780', 'priya@test.com', 'Coimbatore');
GO

-- =============================================
-- PRODUCT PROCEDURES
-- =============================================
CREATE OR ALTER PROC sp_Product_Save
    @ProductId INT = 0,
    @ProductName NVARCHAR(150),
    @Price DECIMAL(18,2),
    @GstPercent DECIMAL(5,2),
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;
    IF @ProductId = 0
        INSERT INTO Products(ProductName, Price, GstPercent, IsActive)
        VALUES(@ProductName, @Price, @GstPercent, @IsActive);
    ELSE
        UPDATE Products
        SET ProductName=@ProductName, Price=@Price, GstPercent=@GstPercent, IsActive=@IsActive
        WHERE ProductId=@ProductId;
END
GO

CREATE OR ALTER PROC sp_Product_GetAll
AS
BEGIN
    SELECT * FROM Products ORDER BY ProductId DESC;
END
GO

CREATE OR ALTER PROC sp_Product_Delete @ProductId INT
AS
BEGIN
    DELETE FROM Products WHERE ProductId=@ProductId;
END
GO

-- =============================================
-- CUSTOMER PROCEDURES
-- =============================================
CREATE OR ALTER PROC sp_Customer_Save
    @CustomerId INT = 0,
    @CustomerName NVARCHAR(150),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @AddressLine NVARCHAR(250),
    @IsActive BIT
AS
BEGIN
    IF @CustomerId = 0
        INSERT INTO Customers(CustomerName, Phone, Email, AddressLine, IsActive)
        VALUES(@CustomerName,@Phone,@Email,@AddressLine,@IsActive);
    ELSE
        UPDATE Customers
        SET CustomerName=@CustomerName, Phone=@Phone, Email=@Email,
            AddressLine=@AddressLine, IsActive=@IsActive
        WHERE CustomerId=@CustomerId;
END
GO

CREATE OR ALTER PROC sp_Customer_GetAll
AS
BEGIN
    SELECT * FROM Customers ORDER BY CustomerId DESC;
END
GO

CREATE OR ALTER PROC sp_Customer_Delete @CustomerId INT
AS
BEGIN
    DELETE FROM Customers WHERE CustomerId=@CustomerId;
END
GO

-- =============================================
-- INVOICE SAVE PROCEDURE
-- =============================================
CREATE OR ALTER PROC sp_Invoice_Save
    @InvoiceDate DATE,
    @CustomerId INT,
    @SubTotal DECIMAL(18,2),
    @GstTotal DECIMAL(18,2),
    @GrandTotal DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NextId INT = ISNULL((SELECT MAX(InvoiceId) + 1 FROM InvoiceHeader),1);
    DECLARE @InvoiceNo NVARCHAR(30) = CONCAT('INV', FORMAT(GETDATE(),'yyyy'), RIGHT('0000' + CAST(@NextId AS VARCHAR),4));

    INSERT INTO InvoiceHeader(InvoiceNo, InvoiceDate, CustomerId, SubTotal, GstTotal, GrandTotal)
    VALUES(@InvoiceNo, @InvoiceDate, @CustomerId, @SubTotal, @GstTotal, @GrandTotal);

    SELECT SCOPE_IDENTITY() AS InvoiceId, @InvoiceNo AS InvoiceNo;
END
GO

CREATE OR ALTER PROC sp_InvoiceItem_Save
    @InvoiceId INT,
    @ProductId INT,
    @Qty INT,
    @Rate DECIMAL(18,2),
    @GstPercent DECIMAL(5,2),
    @Amount DECIMAL(18,2),
    @GstAmount DECIMAL(18,2),
    @Total DECIMAL(18,2)
AS
BEGIN
    INSERT INTO InvoiceItems(InvoiceId, ProductId, Qty, Rate, GstPercent, Amount, GstAmount, Total)
    VALUES(@InvoiceId,@ProductId,@Qty,@Rate,@GstPercent,@Amount,@GstAmount,@Total);
END
GO

CREATE OR ALTER PROC sp_Invoice_List
    @InvoiceNo NVARCHAR(30)=NULL,
    @CustomerId INT=0,
    @FromDate DATE=NULL,
    @ToDate DATE=NULL
AS
BEGIN
    SELECT h.InvoiceId, h.InvoiceNo, h.InvoiceDate, c.CustomerName,
           h.SubTotal, h.GstTotal, h.GrandTotal
    FROM InvoiceHeader h
    INNER JOIN Customers c ON h.CustomerId = c.CustomerId
    WHERE (@InvoiceNo IS NULL OR h.InvoiceNo LIKE '%' + @InvoiceNo + '%')
      AND (@CustomerId = 0 OR h.CustomerId = @CustomerId)
      AND (@FromDate IS NULL OR h.InvoiceDate >= @FromDate)
      AND (@ToDate IS NULL OR h.InvoiceDate <= @ToDate)
    ORDER BY h.InvoiceId DESC;
END
GO

CREATE OR ALTER PROC sp_Invoice_View @InvoiceId INT
AS
BEGIN
    SELECT h.InvoiceId, h.InvoiceNo, h.InvoiceDate, c.CustomerName, c.Phone,
           h.SubTotal, h.GstTotal, h.GrandTotal
    FROM InvoiceHeader h
    INNER JOIN Customers c ON h.CustomerId = c.CustomerId
    WHERE h.InvoiceId=@InvoiceId;

    SELECT i.ItemId, p.ProductName, i.Qty, i.Rate, i.GstPercent,
           i.Amount, i.GstAmount, i.Total
    FROM InvoiceItems i
    INNER JOIN Products p ON i.ProductId = p.ProductId
    WHERE i.InvoiceId=@InvoiceId;
END
GO
