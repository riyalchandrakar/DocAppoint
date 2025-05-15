import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Users, ChevronDown, Home, UserCircle, Calendar as CalendarIcon, Hospital, LogOut, PlusCircle, Edit, X, Check ,User, Mail, Phone} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants/constants';
import { toast } from "react-hot-toast";

const Button = ({ children, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  const variantClasses = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-md hover:shadow-teal-500/30',
    secondary: 'bg-white text-teal-700 border border-teal-600 hover:bg-teal-50 focus:ring-teal-500',
    ghost: 'text-teal-600 hover:bg-teal-50 focus:ring-teal-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
    {Icon && <Icon className="w-5 h-5 text-teal-600" />}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>{children}</div>
);

const Input = ({ label, icon: Icon, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  </div>
);

const Select = ({ label, className = '', children, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select
      className={`block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-teal-100 text-teal-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const AppointmentCard = ({ appointment, onCancel }) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + `/patient/cancel-appointment/${appointment._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success('Appointment cancelled successfully');
        onCancel();
      } else {
        toast.error('Failed to cancel appointment');
      }
    } catch (error) {
      toast.error('Error cancelling appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">
            Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
          </h4>
          <p className="text-sm text-gray-500">{appointment.reason}</p>
        </div>
        <Badge variant={appointment.status === 'completed' ? 'success' : appointment.status === 'cancelled' ? 'danger' : 'primary'}>
          {appointment.status}
        </Badge>
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-500">
        <Calendar className="w-4 h-4 mr-1" />
        <span>{new Date(appointment.date).toLocaleDateString()}</span>
        <Clock className="w-4 h-4 ml-3 mr-1" />
        <span>{appointment.time}</span>
      </div>
      {appointment.status === 'scheduled' && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel'}
          </Button>
        </div>
      )}
    </div>
  );
};

const PrescriptionCard = ({ prescription }) => (
  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-gray-900">{prescription.medication}</h4>
        <p className="text-sm text-gray-500">{prescription.dosage} - {prescription.frequency}</p>
      </div>
      <Badge variant="secondary">
        {new Date(prescription.tilldate).toLocaleDateString()}
      </Badge>
    </div>
    <div className="mt-2 text-sm text-gray-500">
      <p>Prescribed by: Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}</p>
      <p className="mt-1">{prescription.notes}</p>
    </div>
  </div>
);

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [careTeam, setCareTeam] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchPatientProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/patient/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatientInfo(data);
        setEditedInfo(data);
      } else {
        console.error('Failed to fetch patient profile');
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/doctor/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + `/patient/available-slots?doctorId=${doctorId}&date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const slots = await response.json();
        setAvailableSlots(slots);
      } else {
        console.error('Failed to fetch available slots');
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/patient/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchCompletedAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(BASE_URL + '/patient/appointment/completed-cancelled', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setCompletedAppointments(data);
      } else {
        console.error('Failed to fetch completed/cancelled appointments');
      }
    } catch (error) {
      console.error('Error fetching completed/cancelled appointments:', error);
    }
  };

  const fetchCareTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/patient/care-team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCareTeam(data);
      } else {
        console.error('Failed to fetch care team');
      }
    } catch (error) {
      console.error('Error fetching care team:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(BASE_URL + '/patient/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      } else {
        console.error('Failed to fetch prescriptions');
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  useEffect(() => {
    fetchPatientProfile();
    fetchDoctors();
    fetchAppointments();
    fetchCareTeam();
    fetchPrescriptions();
    fetchCompletedAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + '/patient/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedInfo)
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setPatientInfo(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));

    if (name === 'date' || name === 'doctorId') {
      fetchAvailableSlots(appointmentData.doctorId, value);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + '/patient/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });
      if (response.ok) {
        const result = await response.json();
        setAppointmentData({
          doctorId: '',
          date: '',
          time: '',
          reason: ''
        });
        setAvailableSlots([]);
        fetchAppointments();
        toast.success('Appointment booked successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to book appointment');
      }
    } catch (error) {
      toast.error('Error booking appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + `/patient/cancel-appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchAppointments();
        fetchCompletedAppointments();
        toast.success('Appointment cancelled successfully');
      } else {
        toast.error('Failed to cancel appointment');
      }
    } catch (error) {
      toast.error('Error cancelling appointment');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader icon={Calendar}>Upcoming Appointments</CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onCancel={() => handleCancelAppointment(appointment._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming appointments</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setActiveTab('book-appointment')}
                  icon={PlusCircle}
                >
                  Book Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader icon={FileText}>Active Prescriptions</CardHeader>
          <CardContent>
            {prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription._id}
                    prescription={prescription}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active prescriptions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader icon={Users}>Your Care Team</CardHeader>
          <CardContent>
            {careTeam.length > 0 ? (
              <ul className="space-y-4">
                {careTeam.map((doctor) => (
                  <li key={doctor._id} className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      <p className="text-xs text-gray-400 mt-1">{doctor.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No care team members</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader icon={Clock}>Recent Activity</CardHeader>
          <CardContent>
            {completedAppointments.length > 0 ? (
              <ul className="space-y-3">
                {completedAppointments.slice(0, 5).map((appointment) => (
                  <li key={appointment._id} className="flex items-start">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {appointment.status === 'completed' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.status === 'completed' ? 'Completed' : 'Cancelled'} appointment with Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProfile = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
          {isEditing ? (
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSaveProfile} icon={Check}>
                Save
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
                icon={X}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              icon={Edit}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            name="firstName"
            value={isEditing ? editedInfo?.firstName || '' : patientInfo?.firstName || ''}
            onChange={handleInputChange}
            readOnly={!isEditing}
            icon={User}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={isEditing ? editedInfo?.lastName || '' : patientInfo?.lastName || ''}
            onChange={handleInputChange}
            readOnly={!isEditing}
            icon={User}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={isEditing ? editedInfo?.email || '' : patientInfo?.email || ''}
            onChange={handleInputChange}
            readOnly={!isEditing}
            icon={Mail}
          />
          <Input
            label="Phone Number"
            name="phone"
            value={isEditing ? editedInfo?.phone || '' : patientInfo?.phone || ''}
            onChange={handleInputChange}
            readOnly={!isEditing}
            icon={Phone}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderBookAppointment = () => (
    <Card>
      <CardHeader icon={Calendar}>Book New Appointment</CardHeader>
      <CardContent>
        <form onSubmit={handleBookAppointment} className="space-y-4">
          <Select
            label="Select Doctor"
            name="doctorId"
            value={appointmentData.doctorId}
            onChange={handleAppointmentInputChange}
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
              </option>
            ))}
          </Select>

          <Input
            label="Appointment Date"
            name="date"
            type="date"
            value={appointmentData.date}
            onChange={handleAppointmentInputChange}
            icon={Calendar}
          />

          <Select
            label="Preferred Time"
            name="time"
            value={appointmentData.time}
            onChange={handleAppointmentInputChange}
            disabled={availableSlots.length === 0}
          >
            <option value="">{availableSlots.length > 0 ? 'Select a time slot' : 'Select a doctor and date first'}</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </Select>

          <Input
            label="Reason for Visit"
            name="reason"
            value={appointmentData.reason}
            onChange={handleAppointmentInputChange}
            placeholder="Brief description of your concern"
            icon={FileText}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={!appointmentData.doctorId || !appointmentData.date || !appointmentData.time}>
              Book Appointment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-teal-600" />
            <span className="text-xl font-bold text-gray-800">DocAppoint</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-teal-50">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {patientInfo?.firstName} {patientInfo?.lastName}
              </h4>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
          </div>
        </div>
        <nav className="mt-2 px-2 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'dashboard' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Home className={`mr-3 h-5 w-5 ${activeTab === 'dashboard' ? 'text-teal-600' : 'text-gray-400'}`} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <UserCircle className={`mr-3 h-5 w-5 ${activeTab === 'profile' ? 'text-teal-600' : 'text-gray-400'}`} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('book-appointment')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'book-appointment' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <CalendarIcon className={`mr-3 h-5 w-5 ${activeTab === 'book-appointment' ? 'text-teal-600' : 'text-gray-400'}`} />
            Book Appointment
          </button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            icon={LogOut}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'book-appointment' && 'Book Appointment'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'book-appointment' && renderBookAppointment()}
          </div>
        </main>
      </div>
    </div>
  );
}