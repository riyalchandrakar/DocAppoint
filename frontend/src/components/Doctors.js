import { useCallback,useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, ChevronDown, Home, 
  UserCircle, Hospital, CheckCircle, XCircle, PlusCircle,
  Stethoscope, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants/constants';
import { toast } from "react-hot-toast";

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

const Input = ({ label, className = '', ...props }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
      {...props}
    />
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

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    date: '',
    time: '',
    reason: '',
    prescriptionId: '',
    medication: '',
    dosage: '',
    frequency: '',
    tilldate: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [existingPrescriptions, setExistingPrescriptions] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    todayAppointments: false,
    patients: false
  });

  const navigate = useNavigate();

 

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ... (keep all your existing fetch functions like fetchDoctorProfile, fetchPatientsWithAppointments, etc.)
  // Add these functions inside your DoctorDashboard component, before the render methods

const fetchDoctorProfile = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await fetch(BASE_URL + '/doctor/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setDoctorInfo(data);
      setEditedInfo(data);
    } else {
      console.error('Failed to fetch doctor profile');
    }
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
  }
},[navigate]);

const fetchPatientsWithAppointments = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await fetch(BASE_URL + '/doctor/patients-with-appointments', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setPatients(data);
    } else {
      console.error('Failed to fetch patients with appointments');
    }
  } catch (error) {
    console.error('Error fetching patients with appointments:', error);
  }
},[navigate]);

const fetchAppointments = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await fetch(BASE_URL + '/doctor/appointments', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      const now = new Date();
      const sortedAppointments = data
        .filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return (
            appointmentDate > now || 
            (
              appointmentDate.toLocaleDateString() === now.toLocaleDateString() && 
              appointment.time > now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            )
          );
        })
        .sort((a, b) => {
          const dateA = new Date(a.date + ' ' + a.time);
          const dateB = new Date(b.date + ' ' + b.time);
          return dateA - dateB;
        });
      setAppointments(sortedAppointments);
    } else {
      console.error('Failed to fetch appointments');
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
},[navigate]);

const fetchCompletedAppointments = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await fetch(BASE_URL + '/doctor/appointment/completed', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      const sortedCompleted = data.sort((a, b) => 
        new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
      );
      setCompletedAppointments(sortedCompleted);
    } else {
      console.error('Failed to fetch completed appointments');
    }
  } catch (error) {
    console.error('Error fetching completed appointments:', error);
  }
},[navigate]);


const fetchExistingPrescriptions = useCallback(async (patientId) => {
  if (!patientId) return;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + `/doctor/prescriptions/${patientId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const prescriptions = await response.json();
      setExistingPrescriptions(prescriptions);
    } else {
      console.error('Failed to fetch existing prescriptions');
      setExistingPrescriptions([]);
    }
  } catch (error) {
    console.error('Error fetching existing prescriptions:', error);
    setExistingPrescriptions([]);
  }
},[]);


const fetchUpcomingAppointments = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await fetch(BASE_URL + '/doctor/appointments/upcoming', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      const sortedUpcoming = data.sort((a, b) =>
        new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
      );
      setUpcomingAppointments(sortedUpcoming);
    } else {
      console.error('Failed to fetch upcoming appointments');
    }
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
  }
},[navigate]);

 useEffect(() => {
    fetchDoctorProfile();
    fetchPatientsWithAppointments();
    fetchAppointments();
    fetchCompletedAppointments();
    fetchUpcomingAppointments();
  }, [fetchDoctorProfile,
  fetchAppointments,
  fetchCompletedAppointments,
  fetchPatientsWithAppointments,
  fetchUpcomingAppointments]);

const handleUpdateStatus = async (appointmentId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + `/doctor/appointment/${appointmentId}/${status}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ appointmentId })
    });
    if (response.ok) {
      fetchAppointments();
      fetchCompletedAppointments();
      toast.success("Appointment status updated.");
    } else {
      toast.error("Failed to update appointment status");
    }
  } catch (error) {
    console.error('Error updating appointment status:', error);
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setAppointmentData(prev => ({ ...prev, [name]: value }));

  if (name === 'action') {
    setSelectedAction(value);
  }

  if (name === 'patientId') {
    fetchExistingPrescriptions(value);
  }

  if (name === 'date' || name === 'patientId') {
    fetchAvailableSlots(appointmentData.patientId, value);
  }
};

const handleEditPrescription = (prescription) => {
  setAppointmentData({
    ...appointmentData,
    prescriptionId: prescription._id,
    medication: prescription.medication || '',
    dosage: prescription.dosage || '',
    frequency: prescription.frequency || '',
    tilldate: prescription.tilldate || ''
  });
  setSelectedAction('prescribe-medication');
};

const handleDeletePrescription = async (prescriptionId) => {
  if (window.confirm('Are you sure you want to delete this prescription?')) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(BASE_URL + `/doctor/prescriptions/${prescriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchExistingPrescriptions(appointmentData.patientId);
        toast.success('Prescription deleted successfully.');
      } else {
        const errorData = await response.json();
        console.error('Error details:', errorData.details);
        toast.error(`Failed to delete prescription.`);
      }
    } catch (error) {
      toast.error('Error deleting prescription. Please try again.');
      console.error('Error deleting prescription:', error);
    }
  }
};

// Also add this helper function if not already present
const fetchAvailableSlots = async (patientId, date) => {
  if (!patientId || !date) return;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + `/doctor/available-slots?patientId=${patientId}&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const slots = await response.json();
      setAvailableSlots(slots);
    } else {
      console.error('Failed to fetch available slots');
      setAvailableSlots([]);
      toast.error("Failed to fetch available slots");
    }
  } catch (error) {
    console.error('Error fetching available slots:', error);
    setAvailableSlots([]);
  }
};

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverEffect>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 mr-4">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
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
              <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
            </div>
          </div>
        </Card>
        
        <Card hoverEffect>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold text-gray-800">
                {completedAppointments.filter(a => 
                  new Date(a.date).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader icon={Calendar}>
          Today's Appointments
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toggleSection('todayAppointments')}
            icon={expandedSections.todayAppointments ? ChevronDown : ChevronDown}
            className="transform transition-transform"
            style={{ transform: expandedSections.todayAppointments ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </CardHeader>
        
        {expandedSections.todayAppointments ? (
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      {appointment.patientId.firstName} {appointment.patientId.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.reason}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge>{appointment.time}</Badge>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No appointments scheduled for today</p>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">
              {appointments.length > 0 
                ? `Next: ${appointments[0].patientId.firstName} at ${appointments[0].time}`
                : 'No appointments today'}
            </p>
          </div>
        )}
      </Card>

      {/* Patients List */}
      <Card>
        <CardHeader icon={Users}>
          Recent Patients
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toggleSection('patients')}
            icon={expandedSections.patients ? ChevronDown : ChevronDown}
            className="transform transition-transform"
            style={{ transform: expandedSections.patients ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </CardHeader>
        
        {expandedSections.patients ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-lg hover:border-teal-200 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <h4 className="font-medium text-gray-800">
                    {patient.firstName} {patient.lastName}
                  </h4>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</p>
                  <p>Next appointment: {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">
              {patients.length} patients under your care
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
                    {appointment.status === "completed" ? "Completed" : "Cancelled"} appointment with {appointment.patientId?.firstName}
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
                    Appointment with {appointment.patientId?.firstName}
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

  const renderProfile = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(BASE_URL + '/doctor/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editedInfo)
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setDoctorInfo(updatedProfile);
          setIsEditing(false);
          toast.success("Profile updated successfully.");
        } else {
          toast.error("Failed to update profile.");
        }
      } catch (error) {
        toast.error('Error updating doctor profile. Please try again.');
      }
    };

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader icon={UserCircle}>
          Doctor Profile
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
              value={isEditing ? editedInfo?.firstName : doctorInfo?.firstName}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={isEditing ? editedInfo?.lastName : doctorInfo?.lastName}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={isEditing ? editedInfo?.email : doctorInfo?.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          
          <Input
            label="Specialty"
            name="specialty"
            value={isEditing ? editedInfo?.specialty : doctorInfo?.specialty}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="License Number"
              name="licenseNumber"
              value={isEditing ? editedInfo?.licenseNumber : doctorInfo?.licenseNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={isEditing ? editedInfo?.phoneNumber : doctorInfo?.phoneNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          
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

  const renderPatientManagement = () => {
    // ... (keep your existing patient management logic, but update the UI components)
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader icon={Stethoscope}>
          Patient Management
        </CardHeader>
        
        <div className="space-y-6">
          <Select
            label="Select Patient"
            name="patientId"
            value={appointmentData.patientId}
            onChange={handleInputChange}
          >
            <option value="">Choose a patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </Select>
          
          <Select
            label="Action"
            name="action"
            value={selectedAction}
            onChange={handleInputChange}
          >
            <option value="">Choose an action</option>
            <option value="schedule-appointment">Schedule Appointment</option>
            <option value="prescribe-medication">Prescribe Medication</option>
          </Select>
          
          {selectedAction === 'schedule-appointment' && (
            <>
              <Input
                label="Appointment Date"
                name="date"
                type="date"
                value={appointmentData.date}
                onChange={handleInputChange}
              />
              
              <Select
                label="Preferred Time"
                name="time"
                value={appointmentData.time}
                onChange={handleInputChange}
                disabled={availableSlots.length === 0}
              >
                <option value="">Choose a time slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </Select>
              
              <Input
                label="Reason for Visit"
                name="reason"
                value={appointmentData.reason}
                onChange={handleInputChange}
                placeholder="Brief description of your concern"
              />
            </>
          )}
          
          {selectedAction === 'prescribe-medication' && (
            <>
              {existingPrescriptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Existing Prescriptions</label>
                  <div className="space-y-2">
                    {existingPrescriptions.map((prescription) => (
                      <div key={prescription._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{prescription.medication}</p>
                          <p className="text-sm text-gray-500">
                            {prescription.dosage} - {prescription.frequency} (Till: {new Date(prescription.tilldate).toLocaleDateString()})
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPrescription(prescription)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePrescription(prescription._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Input
                label="Medication"
                name="medication"
                value={appointmentData.medication || ''}
                onChange={handleInputChange}
                placeholder="Medication name"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Dosage"
                  name="dosage"
                  value={appointmentData.dosage || ''}
                  onChange={handleInputChange}
                  placeholder="Dosage"
                />
                <Input
                  label="Frequency"
                  name="frequency"
                  value={appointmentData.frequency || ''}
                  onChange={handleInputChange}
                  placeholder="Frequency"
                />
              </div>
              
              <Input
                label="Till Date"
                name="tilldate"
                type="date"
                value={formatDate(appointmentData.tilldate) || ''}
                onChange={handleInputChange}
              />
            </>
          )}
          
          {selectedAction && (
            <div className="flex justify-end pt-4">
              <Button type="submit">
                {selectedAction === 'prescribe-medication' 
                  ? (appointmentData.prescriptionId ? 'Update Prescription' : 'Prescribe Medication') 
                  : 'Schedule Appointment'}
              </Button>
            </div>
          )}
        </div>
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
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'patients' 
                ? 'bg-teal-50 text-teal-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Patient Management</span>
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
              {activeTab === 'patients' && 'Patient Management'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{doctorInfo?.specialty}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back, Dr. {doctorInfo?.lastName}
            </h2>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'patients' && renderPatientManagement()}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;