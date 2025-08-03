const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');

// Get real statistics from database
router.get('/stats', async (req, res) => {
  try {
    const [studentsCount, teachersCount, classesCount] = await Promise.all([
      Student.countDocuments({ status: 'active' }),
      Teacher.countDocuments({ isActive: true }),
      Class.countDocuments({ isActive: true })
    ]);

    // Calculate today's attendance percentage
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    });

    const presentCount = todayAttendance.filter(att => att.status === 'present').length;
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const attendancePercentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : '0.0';

    res.json({
      students: studentsCount,
      teachers: teachersCount,
      classes: classesCount,
      attendanceToday: `${attendancePercentage}%`,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Get recent activities from database
router.get('/activities', async (req, res) => {
  try {
    const activities = [];

    // Get recent students (last 7 days)
    const recentStudents = await Student.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .populate('user', 'fullName')
    .populate('currentClass', 'name')
    .sort({ createdAt: -1 })
    .limit(3);

    recentStudents.forEach(student => {
      const timeAgo = getTimeAgo(student.createdAt);
      activities.push({
        title: 'Siswa baru terdaftar',
        description: `${student.user.fullName} - ${student.currentClass ? student.currentClass.name : 'Belum ada kelas'}`,
        time: timeAgo,
        type: 'student'
      });
    });

    // Get recent announcements
    const recentAnnouncements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .limit(2);

    recentAnnouncements.forEach(announcement => {
      const timeAgo = getTimeAgo(announcement.createdAt);
      activities.push({
        title: 'Pengumuman baru',
        description: announcement.title,
        time: timeAgo,
        type: 'announcement'
      });
    });

    // Sort activities by time and limit to 5
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // If no real data, provide default activities
    if (activities.length === 0) {
      return res.json([
        {
          title: 'Sistem baru dimulai',
          description: 'Selamat datang di SIMS',
          time: 'Baru saja',
          type: 'system'
        }
      ]);
    }

    res.json(activities.slice(0, 5));
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    res.status(500).json({ message: 'Error fetching dashboard activities' });
  }
});

// Get upcoming events from database
router.get('/events', async (req, res) => {
  try {
    // Get announcements that have future dates or are marked as events
    const upcomingEvents = await Announcement.find({
      $or: [
        { eventDate: { $gte: new Date() } },
        { type: 'event' }
      ]
    })
    .sort({ eventDate: 1 })
    .limit(5);

    const events = upcomingEvents.map(event => ({
      title: event.title,
      date: event.eventDate ? formatDate(event.eventDate) : 'Tanggal belum ditentukan',
      type: event.priority || 'general'
    }));

    // If no real events, provide default events
    if (events.length === 0) {
      const defaultEvents = [
        {
          title: 'Ujian Tengah Semester',
          date: '15 Agustus 2025',
          type: 'exam'
        },
        {
          title: 'Rapat Guru',
          date: '20 Agustus 2025',
          type: 'meeting'
        },
        {
          title: 'Hari Kemerdekaan',
          date: '17 Agustus 2025',
          type: 'holiday'
        }
      ];
      return res.json(defaultEvents);
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching dashboard events:', error);
    res.status(500).json({ message: 'Error fetching dashboard events' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else {
    return `${diffInDays} hari yang lalu`;
  }
}

// Helper function to format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

module.exports = router;

