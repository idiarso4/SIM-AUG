// controllers/gradeController.js

// Simulate a database
let grades = [
  { id: 1, studentId: 101, subjectId: 201, grade: 85, createdAt: new Date() },
  { id: 2, studentId: 102, subjectId: 202, grade: 90, createdAt: new Date() }
];

// Get all grades
exports.getAllGrades = (req, res) => {
  try {
    res.json({
      success: true,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get grade by ID
exports.getGradeById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const grade = grades.find(g => g.id === id);
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    res.json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create a new grade
exports.createGrade = (req, res) => {
  try {
    const { studentId, subjectId, grade } = req.body;
    
    // Validation
    if (!studentId || !subjectId || grade === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, subjectId, and grade'
      });
    }
    
    const newGrade = {
      id: grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1,
      studentId: parseInt(studentId),
      subjectId: parseInt(subjectId),
      grade: parseFloat(grade),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    grades.push(newGrade);
    
    res.status(201).json({
      success: true,
      data: newGrade,
      message: 'Grade created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update a grade by ID
exports.updateGrade = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { grade } = req.body;
    
    const gradeToUpdate = grades.find(g => g.id === id);
    
    if (!gradeToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    if (grade !== undefined) {
      gradeToUpdate.grade = parseFloat(grade);
      gradeToUpdate.updatedAt = new Date();
    }
    
    res.json({
      success: true,
      data: gradeToUpdate,
      message: 'Grade updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete a grade by ID
exports.deleteGrade = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = grades.length;
    
    grades = grades.filter(g => g.id !== id);
    
    if (grades.length < initialLength) {
      res.json({
        success: true,
        message: 'Grade deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};


