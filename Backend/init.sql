Create database employee;
use employee;

CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    hire_date DATE NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50)
);

INSERT INTO employee (first_name, last_name, gender, date_of_birth, email, phone_number, hire_date, job_title, department, salary, address, city, state, postal_code, country) VALUES
('John', 'Doe', 'Male', '1985-01-15', 'john.doe@example.com', '123-456-7890', '2010-06-01', 'Software Engineer', 'IT', 85000.00, '123 Main St', 'New York', 'NY', '10001', 'USA'),
('Jane', 'Smith', 'Female', '1990-05-22', 'jane.smith@example.com', '234-567-8901', '2012-07-15', 'Data Analyst', 'Analytics', 78000.00, '456 Oak St', 'Los Angeles', 'CA', '90001', 'USA'),
('Mike', 'Johnson', 'Male', '1987-03-30', 'mike.johnson@example.com', '345-678-9012', '2015-03-10', 'Project Manager', 'Management', 95000.00, '789 Pine St', 'Chicago', 'IL', '60601', 'USA'),
('Emily', 'Davis', 'Female', '1992-09-12', 'emily.davis@example.com', '456-789-0123', '2018-01-20', 'HR Specialist', 'Human Resources', 72000.00, '101 Maple St', 'Houston', 'TX', '77001', 'USA'),
('Robert', 'Miller', 'Male', '1984-11-25', 'robert.miller@example.com', '567-890-1234', '2013-11-01', 'Accountant', 'Finance', 80000.00, '202 Cedar St', 'Phoenix', 'AZ', '85001', 'USA'),
('Sarah', 'Wilson', 'Female', '1989-08-14', 'sarah.wilson@example.com', '678-901-2345', '2016-05-05', 'Marketing Manager', 'Marketing', 88000.00, '303 Birch St', 'Philadelphia', 'PA', '19101', 'USA'),
('David', 'Brown', 'Male', '1988-02-18', 'david.brown@example.com', '789-012-3456', '2011-09-23', 'Sales Executive', 'Sales', 81000.00, '404 Elm St', 'San Antonio', 'TX', '78201', 'USA'),
('Laura', 'Garcia', 'Female', '1991-07-06', 'laura.garcia@example.com', '890-123-4567', '2014-12-15', 'Customer Service Rep', 'Customer Service', 62000.00, '505 Spruce St', 'San Diego', 'CA', '92101', 'USA'),
('James', 'Martinez', 'Male', '1986-04-11', 'james.martinez@example.com', '901-234-5678', '2017-04-10', 'Product Manager', 'Product', 93000.00, '606 Willow St', 'Dallas', 'TX', '75201', 'USA'),
('Olivia', 'Anderson', 'Female', '1993-11-28', 'olivia.anderson@example.com', '012-345-6789', '2019-08-17', 'Business Analyst', 'Business', 74000.00, '707 Fir St', 'San Jose', 'CA', '95101', 'USA'),
('Daniel', 'Rodriguez', 'Male', '1985-10-04', 'daniel.rodriguez@example.com', '123-456-7891', '2010-07-07', 'Graphic Designer', 'Design', 67000.00, '808 Ash St', 'Austin', 'TX', '73301', 'USA'),
('Sophia', 'Martinez', 'Female', '1990-12-22', 'sophia.martinez@example.com', '234-567-8902', '2012-03-02', 'Network Engineer', 'IT', 86000.00, '909 Chestnut St', 'Jacksonville', 'FL', '32099', 'USA'),
('Matthew', 'Hernandez', 'Male', '1987-05-10', 'matthew.hernandez@example.com', '345-678-9013', '2015-08-29', 'Database Administrator', 'IT', 79000.00, '1010 Beech St', 'Fort Worth', 'TX', '76101', 'USA'),
('Ava', 'Lopez', 'Female', '1992-03-19', 'ava.lopez@example.com', '456-789-0124', '2018-02-15', 'UX Designer', 'Design', 75000.00, '1111 Magnolia St', 'Columbus', 'OH', '43004', 'USA'),
('Andrew', 'Gonzalez', 'Male', '1984-06-16', 'andrew.gonzalez@example.com', '567-890-1235', '2013-06-20', 'System Administrator', 'IT', 83000.00, '1212 Redwood St', 'San Francisco', 'CA', '94101', 'USA'),
('Isabella', 'Clark', 'Female', '1989-09-01', 'isabella.clark@example.com', '678-901-2346', '2016-10-05', 'Operations Manager', 'Operations', 92000.00, '1313 Holly St', 'Charlotte', 'NC', '28201', 'USA'),
('Joshua', 'Lee', 'Male', '1988-07-09', 'joshua.lee@example.com', '789-012-3457', '2011-04-15', 'Quality Assurance', 'QA', 71000.00, '1414 Poplar St', 'Detroit', 'MI', '48201', 'USA'),
('Mia', 'Perez', 'Female', '1991-08-24', 'mia.perez@example.com', '890-123-4568', '2014-11-11', 'Content Writer', 'Content', 68000.00, '1515 Hickory St', 'El Paso', 'TX', '79901', 'USA'),
('Ryan', 'Lewis', 'Male', '1986-12-02', 'ryan.lewis@example.com', '901-234-5679', '2017-06-22', 'Legal Advisor', 'Legal', 89000.00, '1616 Cypress St', 'Memphis', 'TN', '37501', 'USA'),
('Amelia', 'Walker', 'Female', '1993-04-18', 'amelia.walker@example.com', '012-345-6790', '2019-12-01', 'SEO Specialist', 'Marketing', 70000.00, '1717 Dogwood St', 'Seattle', 'WA', '98101', 'USA'),
('Jacob', 'Hall', 'Male', '1985-03-05', 'jacob.hall@example.com', '123-456-7892', '2010-08-19', 'Software Architect', 'IT', 96000.00, '1818 Walnut St', 'Denver', 'CO', '80201', 'USA'),
('Charlotte', 'Allen', 'Female', '1990-10-20', 'charlotte.allen@example.com', '234-567-8903', '2012-05-30', 'Recruiter', 'Human Resources', 73000.00, '1919 Magnolia St', 'Washington', 'DC', '20001', 'USA'),
('Ethan', 'Young', 'Male', '1987-11-07', 'ethan.young@example.com', '345-678-9014', '2015-10-28', 'Technical Support', 'Customer Service', 66000.00, '2020 Palm St', 'Boston', 'MA', '02101', 'USA'),
('Mason', 'King', 'Male', '1988-06-25', 'mason.king@example.com', '456-789-0125', '2011-02-09', 'Business Development', 'Sales', 77000.00, '2121 Redwood St', 'Nashville', 'TN', '37201', 'USA'),
('Abigail', 'Scott', 'Female', '1991-01-30', 'abigail.scott@example.com', '567-890-1236', '2014-07-14', 'Financial Analyst', 'Finance', 82000.00, '2222 Cedar St', 'Baltimore', 'MD', '21201', 'USA');