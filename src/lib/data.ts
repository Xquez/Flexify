// Mock data for GymFlow

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipPlan?: 'Basic' | 'Premium' | 'VIP';
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  role?: 'admin' | 'trainer' | 'member';
};

export const members: User[] = [
  { id: '1', name: 'Olivia Martin', email: 'olivia.martin@email.com', membershipPlan: 'Premium', status: 'Active', joinDate: '2023-01-15' },
  { id: '2', name: 'Jackson Lee', email: 'jackson.lee@email.com', membershipPlan: 'Basic', status: 'Active', joinDate: '2023-02-20' },
  { id: '3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', membershipPlan: 'VIP', status: 'Inactive', joinDate: '2022-11-05' },
  { id: '4', name: 'William Kim', email: 'will@email.com', membershipPlan: 'Premium', status: 'Active', joinDate: '2023-03-10' },
  { id: '5', name: 'Sofia Davis', email: 'sofia.davis@email.com', membershipPlan: 'Basic', status: 'Pending', joinDate: '2023-05-01' },
];

export const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 },
  { month: 'Aug', revenue: 6500 },
  { month: 'Sep', revenue: 7500 },
  { month: 'Oct', revenue: 8000 },
  { month: 'Nov', revenue: 9000 },
  { month: 'Dec', revenue: 10000 },
];

export const attendanceData = [
    { date: '2023-05-01', attendees: 50 },
    { date: '2023-05-02', attendees: 55 },
    { date: '2023-05-03', attendees: 60 },
    { date: '2023-05-04', attendees: 58 },
    { date: '2023-05-05', attendees: 62 },
    { date: '2023-05-06', attendees: 70 },
    { date: '2023-05-07', attendees: 75 },
];


export type Class = {
    id: string;
    name: string;
    trainer: string;
    time: string;
    day: string;
    capacity: number;
    enrolled: number;
}

export const classes: Class[] = [
    { id: 'c1', name: 'Morning Yoga', trainer: 'Alice', time: '8:00 AM - 9:00 AM', day: 'Monday', capacity: 20, enrolled: 15 },
    { id: 'c2', name: 'HIIT', trainer: 'Bob', time: '6:00 PM - 7:00 PM', day: 'Monday', capacity: 25, enrolled: 25 },
    { id: 'c3', name: 'Spin Class', trainer: 'Charlie', time: '7:00 PM - 8:00 PM', day: 'Tuesday', capacity: 30, enrolled: 28 },
    { id: 'c4', name: 'Zumba', trainer: 'Diana', time: '10:00 AM - 11:00 AM', day: 'Wednesday', capacity: 25, enrolled: 18 },
    { id: 'c5', name: 'Pilates', trainer: 'Alice', time: '9:00 AM - 10:00 AM', day: 'Thursday', capacity: 15, enrolled: 15 },
    { id: 'c6', name: 'Weight Lifting 101', trainer: 'Bob', time: '5:00 PM - 6:00 PM', day: 'Friday', capacity: 15, enrolled: 10 },
]
