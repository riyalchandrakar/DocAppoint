import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock,Users, ChevronDown, Home, 
  UserCircle, Eye, EyeOff, Hospital, Stethoscope, Activity, 
  UserPlus, Shield, PlusCircle, LogOut, ClipboardList,CheckCircle,XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants/constants';
import toast from 'react-hot-toast';

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      variant === 'primary'
        ? 'text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-teal-500/30'
        : variant === 'outline'
        ? 'text-teal-700 bg-white hover:bg-gray-50 border border-teal-600'
        : 'text-gray-700 bg-white hover:bg-gray-100'
    } ${className}`}
    {...props}
  >
    {Icon && <Icon className="w-4 h-4 mr-2" />}
    {children}
  </button>
);

const Card = ({ children, className = '', hoverEffect = false }) => (
  <div className={`rounded-xl p-6 transition-all duration-300 ${hoverEffect ? 'hover:shadow-lg hover:border-teal-300' : ''} bg-white border border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 mb-4 border-b border-gray-100 ${className}`}>
    <h3 className="text-lg font-bold text-gray-800">{children}</h3>
    {Icon && <Icon className="w-5 h-5 text-teal-600" />}
  </div>
);

const Input = ({ label, className = '', icon: Icon, ...props }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`mt-1 block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
        {...props}
      />
    </div>
  </div>
);

const Select = ({ label, className = '', children, ...props }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
      {...props}
    >
      {children}
    </select>
  </div>
);

const Badge = ({ children, variant = 'primary', className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'primary' ? 'bg-teal-100 text-teal-800' :
    variant === 'success' ? 'bg-green-100 text-green-800' :
    variant === 'danger' ? 'bg-red-100 text-red-800' :
    'bg-gray-100 text-gray-800'
  } ${className}`}>
    {children}
  </span>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminInfo, setAdminInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    licenseNumber: '',
    phoneNumber: '',
    password: ''
  });
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [doctorOverview, setDoctorOverview] = useState([]);
  const [patientOverview, setPatientOverview] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [hospitalCapacity] = useState(150);
  const [expandedSections, setExpandedSections] = useState({
    doctors: false,
    patients: false
  });

  const navigate = useNavigate();
  

  // ... (keep all your existing fetch functions like fetchAdminProfile, fetchTotalDoctors, etc.)

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle not authenticated case
        return;
      }
      const response = await fetch(BASE_URL + '/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminInfo(data);
        setEditedInfo(data);
      } else {
        // Handle error
        console.error('Failed to fetch admin profile');
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchTotalDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await fetch(BASE_URL + '/admin/total-doctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTotalDoctors(data.totalDoctors);
      } else {
        console.error('Failed to fetch total doctors');
      }
    } catch (error) {
      console.error('Error fetching total doctors:', error);
    }
  };

  const fetchTotalPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await fetch(BASE_URL + '/admin/total-patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTotalPatients(data.totalPatients);
      } else {
        console.error('Failed to fetch total patients');
      }
    } catch (error) {
      console.error('Error fetching total patients:', error);
    }
  };

  const fetchDoctorOverview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await fetch(BASE_URL + '/admin/doctor-overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctorOverview(data);
      } else {
        console.error('Failed to fetch doctor overview');
      }
    } catch (error) {
      console.error('Error fetching doctor overview:', error);
    }
  };

  const fetchPatientOverview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await fetch(BASE_URL + '/admin/patient-overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatientOverview(data);
      } else {
        console.error('Failed to fetch patient overview');
      }
    } catch (error) {
      console.error('Error fetching patient overview:', error);
    }
  };

  const fetchCompletedAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(BASE_URL + '/admin/appointment/completed-cancelled', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched completed/cancelled appointments:', data); // For debugging
        setCompletedAppointments(data);
      } else {
        console.error('Failed to fetch completed/cancelled appointments');
      }
    } catch (error) {
      console.error('Error fetching completed/cancelled appointments:', error);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(BASE_URL + '/admin/appointments/upcoming', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Sort appointments by date and time (soonest first)
        const sortedUpcoming = data.sort((a, b) =>
          new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
        );
  
        setUpcomingAppointments(sortedUpcoming); // Make sure you have this state defined
      } else {
        console.error('Failed to fetch upcoming appointments');
      }
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };


    useEffect(() => {
    fetchAdminProfile();
    fetchTotalDoctors();
    fetchTotalPatients();
    fetchDoctorOverview();
    fetchPatientOverview();
    fetchCompletedAppointments();
    fetchUpcomingAppointments();
  }, [fetchAdminProfile,
  fetchTotalDoctors,
  fetchTotalPatients,
  fetchDoctorOverview,
  fetchPatientOverview,
  fetchCompletedAppointments,
  fetchUpcomingAppointments]);



  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderDashboard = () => {
    const occupancyRate = ((totalPatients / hospitalCapacity) * 100).toFixed(2);
    
    return (
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-100 mr-4">
                <Stethoscope className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-800">{totalDoctors}</p>
              </div>
            </div>
          </Card>
          
          <Card hoverEffect>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">{totalPatients}</p>
              </div>
            </div>
          </Card>
          
          <Card hoverEffect>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hospital Occupancy</p>
                <p className="text-2xl font-bold text-gray-800">{occupancyRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Doctor Overview */}
        <Card>
          <CardHeader icon={Stethoscope}>
            Doctor Overview
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleSection('doctors')}
              icon={ChevronDown}
              className="transform transition-transform"
              style={{ transform: expandedSections.doctors ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </CardHeader>
          
          {expandedSections.doctors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorOverview.map((doctor, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg hover:border-teal-200 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Dr. {doctor.name}
                      </h4>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge>{doctor.patients} patients</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500">
                {doctorOverview.length} doctors on staff
              </p>
            </div>
          )}
        </Card>

        {/* Patient Overview */}
        <Card>
          <CardHeader icon={Users}>
            Patient Overview
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleSection('patients')}
              icon={ChevronDown}
              className="transform transition-transform"
              style={{ transform: expandedSections.patients ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </CardHeader>
          
          {expandedSections.patients ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patientOverview.map((patient, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg hover:border-teal-200 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">
                      {patient.name}
                    </h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge>{patient.appointments} appointments</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500">
                {patientOverview.length} patients in care
              </p>
            </div>
          )}
        </Card>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader icon={Clock}>Recent Activity</CardHeader>
            <div className="space-y-4">
              {completedAppointments.slice(0, 3).map((appointment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {appointment.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {appointment.doctorId?.firstName} {appointment.status === "completed" ? "completed" : "cancelled"} appointment
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                </div>
              ))}
              {completedAppointments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader icon={Calendar}>Upcoming Schedule</CardHeader>
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {appointment.doctorId?.firstName}'s appointment
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                    <Badge variant="primary" className="mt-1">{appointment.reason}</Badge>
                  </div>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No upcoming appointments</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(BASE_URL + '/admin/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firstName: editedInfo.firstName,
            lastName: editedInfo.lastName,
            email: editedInfo.email
          })
        });
        if (response.ok) {
          const updatedAdmin = await response.json();
          setAdminInfo(updatedAdmin.admin);
          setIsEditing(false);
          toast.success("Profile updated successfully.");
        } else {
          toast.error("An error occurred");
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    };

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader icon={UserCircle}>
          Admin Profile
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
              icon={PlusCircle}
            >
              Edit Profile
            </Button>
          )}
        </CardHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={isEditing ? editedInfo?.firstName : adminInfo?.firstName}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={isEditing ? editedInfo?.lastName : adminInfo?.lastName}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={isEditing ? editedInfo?.email : adminInfo?.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
            icon={UserCircle}
          />
          
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderAddDoctor = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setDoctorData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(BASE_URL + '/admin/add-doctor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(doctorData)
        });
        if (response.ok) {
          setDoctorData({
            firstName: '',
            lastName: '',
            email: '',
            specialty: '',
            licenseNumber: '',
            phoneNumber: '',
            password: ''
          });
          fetchDoctorOverview();
          fetchTotalDoctors();
          toast.success('Doctor added successfully');
        } else if (response.status === 401) {
          navigate("/login");
          toast.error('Your session has expired. Please log in again.');
        } else {
          toast.error('An error occurred. Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    };

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader icon={UserPlus}>
          Add New Doctor
        </CardHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={doctorData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={doctorData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={doctorData.email}
            onChange={handleInputChange}
            required
            icon={UserCircle}
          />
          
          <Select
            label="Specialty"
            name="specialty"
            value={doctorData.specialty}
            onChange={handleInputChange}
            required
          >
            <option value="">Choose a specialty</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="oncology">Oncology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="dermatology">Dermatology</option>
            <option value="gastroenterology">Gastroenterology</option>
            <option value="psychiatry">Psychiatry</option>
            <option value="gynecology">Gynecology</option>
          </Select>
          
          <Input
            label="License Number"
            name="licenseNumber"
            value={doctorData.licenseNumber}
            onChange={handleInputChange}
            required
            icon={ClipboardList}
          />
          
          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={doctorData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Password"
            name="password"
            type={showDoctorPassword ? "text" : "password"}
            value={doctorData.password}
            onChange={handleInputChange}
            required
            icon={Shield}
            append={
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 flex items-center"
                onClick={() => setShowDoctorPassword(!showDoctorPassword)}
              >
                {showDoctorPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            }
          />
          
          <div className="flex justify-end pt-4">
            <Button type="submit">
              Add Doctor
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const renderAddAdmin = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAdminData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (adminData.password !== adminData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(BASE_URL + '/admin/add-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(adminData)
        });
        if (response.ok) {
          setAdminData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          toast.success('Admin added successfully');
        } else if (response.status === 401) {
          navigate("/login");
          toast.error('Your session has expired. Please log in again.');
        } else {
          toast.error("An error occurred.");
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    };

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader icon={Shield}>
          Add New Admin
        </CardHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={adminData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={adminData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={adminData.email}
            onChange={handleInputChange}
            required
            icon={UserCircle}
          />
          
          <Input
            label="Password"
            name="password"
            type={showAdminPassword ? "text" : "password"}
            value={adminData.password}
            onChange={handleInputChange}
            required
            icon={Shield}
            append={
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 flex items-center"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
              >
                {showAdminPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            }
          />
          
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showAdminPassword ? "text" : "password"}
            value={adminData.confirmPassword}
            onChange={handleInputChange}
            required
            icon={Shield}
          />
          
          <div className="flex justify-end pt-4">
            <Button type="submit">
              Add Admin
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Hospital className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold text-gray-800">DocAppoint</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-teal-50 text-teal-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'bg-teal-50 text-teal-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('add-doctor')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'add-doctor' 
                ? 'bg-teal-50 text-teal-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Doctor</span>
          </button>
          
          <button
            onClick={() => setActiveTab('add-admin')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'add-admin' 
                ? 'bg-teal-50 text-teal-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Add Admin</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/logout')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'add-doctor' && 'Add New Doctor'}
              {activeTab === 'add-admin' && 'Add New Admin'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {adminInfo?.firstName} {adminInfo?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Hospital Overview'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'add-doctor' && 'Register New Doctor'}
              {activeTab === 'add-admin' && 'Register New Administrator'}
            </h2>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'add-doctor' && renderAddDoctor()}
          {activeTab === 'add-admin' && renderAddAdmin()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;