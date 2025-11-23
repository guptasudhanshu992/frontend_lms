import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Stack,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Publish,
  Image as ImageIcon,
  Delete,
  Add,
  Edit,
  ExpandMore,
  ExpandLess,
  DragIndicator,
  PlayCircleOutline,
} from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import SEO from '../../components/SEO';
import api from '../../api';

export default function CourseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Curriculum state
  const [sections, setSections] = useState([]);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  
  // Quiz state
  const [quizzes, setQuizzes] = useState([]);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    duration_minutes: 30,
    passing_score: 70,
    max_attempts: null,
    show_correct_answers: true,
    randomize_questions: false,
    randomize_options: false,
    published: true,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    points: 1,
    order: 0,
    explanation: '',
    options: [
      { option_text: '', is_correct: false, order: 0 },
      { option_text: '', is_correct: false, order: 1 }
    ]
  });
  
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    order: 0,
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    duration: '',
    order: 0,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'beginner',
    price: '',
    category: '',
    image_url: '',
    published: false,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCourse();
      fetchQuizzes();
    }
  }, [id]);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get(`/api/admin/quizzes?course_id=${id}`);
      setQuizzes(response.data.quizzes || []);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
  };

  // Curriculum management functions
  const handleAddSection = () => {
    if (!sectionForm.title) {
      setError('Section title is required');
      return;
    }

    const newSection = {
      id: Date.now(),
      title: sectionForm.title,
      description: sectionForm.description,
      order: sections.length,
      lessons: [],
    };

    setSections([...sections, newSection]);
    setOpenSectionDialog(false);
    setSectionForm({ title: '', description: '', order: 0 });
    setSuccess('Section added successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateSection = () => {
    if (!sectionForm.title) {
      setError('Section title is required');
      return;
    }

    setSections(sections.map(s => 
      s.id === editingSection.id 
        ? { ...s, title: sectionForm.title, description: sectionForm.description }
        : s
    ));
    setOpenSectionDialog(false);
    setEditingSection(null);
    setSectionForm({ title: '', description: '', order: 0 });
    setSuccess('Section updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteSection = (sectionId) => {
    if (!confirm('Are you sure you want to delete this section? All lessons in this section will be removed.')) return;
    setSections(sections.filter(s => s.id !== sectionId));
    setSuccess('Section deleted successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddLesson = () => {
    if (!lessonForm.title || !selectedSectionId) {
      setError('Lesson title and section are required');
      return;
    }

    const newLesson = {
      id: Date.now(),
      title: lessonForm.title,
      description: lessonForm.description,
      content: lessonForm.content,
      video_url: lessonForm.video_url,
      duration: lessonForm.duration,
      order: 0,
    };

    setSections(sections.map(s => {
      if (s.id === selectedSectionId) {
        return {
          ...s,
          lessons: [...s.lessons, { ...newLesson, order: s.lessons.length }]
        };
      }
      return s;
    }));

    setOpenLessonDialog(false);
    setLessonForm({ title: '', description: '', content: '', video_url: '', duration: '', order: 0 });
    setSelectedSectionId(null);
    setSuccess('Lesson added successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateLesson = () => {
    if (!lessonForm.title) {
      setError('Lesson title is required');
      return;
    }

    setSections(sections.map(s => ({
      ...s,
      lessons: s.lessons.map(l =>
        l.id === editingLesson.id
          ? {
              ...l,
              title: lessonForm.title,
              description: lessonForm.description,
              content: lessonForm.content,
              video_url: lessonForm.video_url,
              duration: lessonForm.duration,
            }
          : l
      )
    })));

    setOpenLessonDialog(false);
    setEditingLesson(null);
    setLessonForm({ title: '', description: '', content: '', video_url: '', duration: '', order: 0 });
    setSuccess('Lesson updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteLesson = (sectionId, lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lessons: s.lessons.filter(l => l.id !== lessonId)
        };
      }
      return s;
    }));
    setSuccess('Lesson deleted successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const openEditSectionDialog = (section) => {
    setEditingSection(section);
    setSectionForm({
      title: section.title,
      description: section.description,
      order: section.order,
    });
    setOpenSectionDialog(true);
  };

  const openEditLessonDialog = (lesson, sectionId) => {
    setEditingLesson(lesson);
    setSelectedSectionId(sectionId);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      video_url: lesson.video_url,
      duration: lesson.duration,
      order: lesson.order,
    });
    setOpenLessonDialog(true);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Quiz handler functions
  const handleAddQuestionOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [
        ...currentQuestion.options,
        { option_text: '', is_correct: false, order: currentQuestion.options.length }
      ]
    });
  };

  const handleRemoveQuestionOption = (index) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((_, i) => i !== index)
    });
  };

  const handleUpdateQuestionOption = (index, field, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleAddQuestionToQuiz = () => {
    if (!currentQuestion.question_text) {
      setError('Please enter a question');
      return;
    }
    if (currentQuestion.options.length < 2) {
      setError('Please add at least 2 options');
      return;
    }
    if (!currentQuestion.options.some(opt => opt.is_correct)) {
      setError('Please mark at least one option as correct');
      return;
    }

    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { ...currentQuestion, order: quizForm.questions.length }]
    });

    // Reset current question
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      order: 0,
      explanation: '',
      options: [
        { option_text: '', is_correct: false, order: 0 },
        { option_text: '', is_correct: false, order: 1 }
      ]
    });
  };

  const handleRemoveQuestionFromQuiz = (index) => {
    setQuizForm({
      ...quizForm,
      questions: quizForm.questions.filter((_, i) => i !== index)
    });
  };

  const handleSaveQuiz = async () => {
    try {
      if (!quizForm.title) {
        setError('Please enter quiz title');
        return;
      }
      if (quizForm.questions.length === 0) {
        setError('Please add at least one question');
        return;
      }

      const quizData = {
        ...quizForm,
        course_id: id ? parseInt(id) : null
      };

      if (editingQuiz) {
        await api.put(`/api/admin/quizzes/${editingQuiz.id}`, quizData);
        setSuccess('Quiz updated successfully');
        // Refresh quiz list
        const response = await api.get(`/api/admin/quizzes?course_id=${id}`);
        setQuizzes(response.data.quizzes || []);
      } else {
        const response = await api.post('/api/admin/quizzes', quizData);
        setSuccess('Quiz created successfully');
        // Add to local list
        setQuizzes([...quizzes, { ...quizData, id: response.data.id }]);
      }

      setOpenQuizDialog(false);
      setEditingQuiz(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await api.delete(`/api/admin/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      setSuccess('Quiz deleted successfully');
    } catch (err) {
      setError('Failed to delete quiz');
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/api/admin/courses/${id}`);
      const course = response.data;
      setFormData({
        title: course.title || '',
        description: course.description || '',
        instructor: course.instructor || '',
        duration: course.duration || '',
        level: course.level || 'beginner',
        price: course.price || '',
        category: course.category || '',
        image_url: course.image_url || '',
        published: course.published || false,
      });
    } catch (err) {
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/api/r2/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, image_url: response.data.url });
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (publishNow = false) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.instructor || !formData.duration || !formData.category) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Validate price is a number
      if (formData.price && isNaN(parseFloat(formData.price))) {
        setError('Price must be a valid number');
        setSaving(false);
        return;
      }

      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        published: publishNow || formData.published
      };

      if (isEditMode) {
        await api.put(`/api/admin/courses/${id}`, payload);
        setSuccess('Course updated successfully!');
      } else {
        await api.post('/api/admin/courses', payload);
        setSuccess('Course created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/courses');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title={`${isEditMode ? 'Edit' : 'Create'} Course - Admin Panel`}
        description="Create or edit courses for your learning management system."
      />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/courses')}
          sx={{ mb: 2 }}
        >
          Back to Courses Management
        </Button>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Course' : 'Create New Course'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode ? 'Update your course with the latest information' : 'Fill in the details to create a new course'}
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="Course Details" />
              <Tab label="Sections" />
              <Tab label="Lessons" />
              <Tab label="Quizzes" />
            </Tabs>
            
            <CardContent sx={{ p: 4 }}>
              {/* Tab Panel 0: Course Details */}
              {activeTab === 0 && (
                <Box>
                  {/* Basic Information */}
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Course Information
                  </Typography>

              <TextField
                fullWidth
                label="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
                required
                placeholder="Enter course title"
                helperText="Give your course a clear, descriptive title"
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={6}
                required
                placeholder="Describe what students will learn in this course"
                helperText={`${formData.description.length} characters`}
              />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                    placeholder="Instructor name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="e.g., Programming, Design, Business"
                    helperText="Main category for this course"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Course Details */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Course Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    placeholder="e.g., 8 weeks, 40 hours"
                    helperText="Course length"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Level *</InputLabel>
                    <Select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      label="Level *"
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    type="number"
                    helperText="Enter 0 for free courses"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Course Image */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Course Image
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={uploadingImage ? <CircularProgress size={20} /> : <ImageIcon />}
                  disabled={uploadingImage}
                  fullWidth
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Course Image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>

                {formData.image_url && (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <img 
                      src={formData.image_url} 
                      alt={formData.title} 
                      style={{ 
                        width: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }} 
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}

                <Alert severity="info">
                  Recommended image size: 1200x600px or 2:1 aspect ratio
                </Alert>
              </Box>
            </Box>
          )}

          {/* Tab Panel 1: Sections */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Course Sections
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setEditingSection(null);
                    setSectionForm({ title: '', description: '', order: 0 });
                    setOpenSectionDialog(true);
                  }}
                >
                  Add Section
                </Button>
              </Box>

              {sections.length === 0 ? (
                <Alert severity="info">
                  No sections added yet. Click "Add Section" to start building your course curriculum.
                </Alert>
              ) : (
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                  {sections.map((section, sectionIndex) => (
                    <ListItem
                      key={section.id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 2,
                        bgcolor: 'grey.50',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start' }}>
                        <DragIndicator sx={{ mr: 1, color: 'text.secondary', mt: 1 }} />
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              Section {sectionIndex + 1}: {section.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              {section.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {section.description}
                                </Typography>
                              )}
                              <Chip
                                label={`${section.lessons.length} lesson${section.lessons.length !== 1 ? 's' : ''}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </>
                          }
                          sx={{ flex: 1 }}
                        />
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => openEditSectionDialog(section)}
                            sx={{ mr: 1 }}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSection(section.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Tab Panel 2: Lessons */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Course Lessons
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    if (sections.length === 0) {
                      setError('Please create at least one section before adding lessons');
                      setTimeout(() => setError(''), 3000);
                      return;
                    }
                    setEditingLesson(null);
                    setSelectedSectionId(sections[0].id);
                    setLessonForm({ title: '', description: '', content: '', video_url: '', duration: '', order: 0 });
                    setOpenLessonDialog(true);
                  }}
                  disabled={sections.length === 0}
                >
                  Add Lesson
                </Button>
              </Box>

              {sections.length === 0 ? (
                <Alert severity="warning">
                  No sections available. Please create a section first in the "Sections" tab.
                </Alert>
              ) : (
                <>
                  {sections.map((section, sectionIndex) => (
                    <Box key={section.id} sx={{ mb: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 2,
                        borderRadius: 1,
                        mb: 1
                      }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Section {sectionIndex + 1}: {section.title}
                        </Typography>
                        <Chip
                          label={`${section.lessons.length} lesson${section.lessons.length !== 1 ? 's' : ''}`}
                          size="small"
                          sx={{ bgcolor: 'white', color: 'primary.main' }}
                        />
                      </Box>

                      {section.lessons.length === 0 ? (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          No lessons in this section yet.
                        </Alert>
                      ) : (
                        <List sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
                          {section.lessons.map((lesson, lessonIndex) => (
                            <ListItem
                              key={lesson.id}
                              sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                                pl: 4,
                              }}
                            >
                              <PlayCircleOutline sx={{ mr: 2, color: 'primary.main' }} />
                              <ListItemText
                                primary={
                                  <Typography variant="body1" fontWeight="medium">
                                    Lesson {lessonIndex + 1}: {lesson.title}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ mt: 0.5 }}>
                                    {lesson.description && (
                                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {lesson.description}
                                      </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      {lesson.duration && (
                                        <Chip label={lesson.duration} size="small" />
                                      )}
                                      {lesson.video_url && (
                                        <Chip label="Video" size="small" color="success" />
                                      )}
                                    </Box>
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditLessonDialog(section.id, lesson)}
                                  sx={{ mr: 1 }}
                                  color="primary"
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteLesson(section.id, lesson.id)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  ))}
                </>
              )}
            </Box>
          )}

          {/* Tab Panel 3: Quizzes */}
          {activeTab === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Course Quizzes
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setEditingQuiz(null);
                    setQuizForm({
                      title: '',
                      description: '',
                      duration_minutes: 30,
                      passing_score: 70,
                      max_attempts: null,
                      show_correct_answers: true,
                      randomize_questions: false,
                      randomize_options: false,
                      published: true,
                      questions: []
                    });
                    setOpenQuizDialog(true);
                  }}
                >
                  Create Quiz
                </Button>
              </Box>

              {quizzes.length === 0 ? (
                <Alert severity="info">
                  No quizzes created yet. Click "Create Quiz" to add your first quiz.
                </Alert>
              ) : (
                <List>
                  {quizzes.map((quiz, quizIndex) => (
                    <ListItem
                      key={quiz.id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 2,
                        display: 'block',
                        p: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {quiz.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {quiz.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={`${quiz.questions?.length || 0} Questions`}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={`${quiz.duration_minutes} min`}
                              size="small"
                            />
                            <Chip
                              label={`Pass: ${quiz.passing_score}%`}
                              size="small"
                              color="success"
                            />
                            {quiz.max_attempts && (
                              <Chip
                                label={`Max Attempts: ${quiz.max_attempts}`}
                                size="small"
                                color="warning"
                              />
                            )}
                            <Chip
                              label={quiz.published ? 'Published' : 'Draft'}
                              size="small"
                              color={quiz.published ? 'success' : 'default'}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setEditingQuiz(quiz);
                              setQuizForm(quiz);
                              setOpenQuizDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Publish Settings */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Publish Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Published"
                />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, ml: 4 }}>
                  Make this course visible to students
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Action Buttons */}
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Publish />}
                    onClick={() => handleSave(true)}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Publish Course'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<Save />}
                    onClick={() => handleSave(false)}
                    disabled={saving}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => navigate('/admin/courses')}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Course Stats Preview */}
            <Card elevation={1} sx={{ bgcolor: 'info.50' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  📊 Course Preview
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Level:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Duration:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formData.duration || 'Not set'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Price:</Typography>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {formData.price ? `$${formData.price}` : 'Free'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      color={formData.published ? 'success.main' : 'warning.main'}
                    >
                      {formData.published ? 'Published' : 'Draft'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card elevation={1} sx={{ bgcolor: 'primary.50' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  💡 Quick Tips
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Use a clear, compelling title
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Write a detailed description of learning outcomes
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Upload a high-quality course image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Set appropriate level and duration
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Section Dialog */}
      <Dialog open={openSectionDialog} onClose={() => setOpenSectionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Section Title"
            value={sectionForm.title}
            onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., Introduction to React"
            autoFocus
          />
          <TextField
            fullWidth
            label="Section Description"
            value={sectionForm.description}
            onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            placeholder="Brief description of what this section covers"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenSectionDialog(false);
            setEditingSection(null);
            setSectionForm({ title: '', description: '', order: 0 });
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={editingSection ? handleUpdateSection : handleAddSection}
          >
            {editingSection ? 'Update' : 'Add'} Section
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={openLessonDialog} onClose={() => setOpenLessonDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Section</InputLabel>
            <Select
              value={selectedSectionId || ''}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              label="Section"
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Lesson Title"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., Introduction to Components"
            autoFocus
          />
          <TextField
            fullWidth
            label="Lesson Description"
            value={lessonForm.description}
            onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Brief description of this lesson"
          />
          <TextField
            fullWidth
            label="Video URL"
            value={lessonForm.video_url}
            onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
            margin="normal"
            placeholder="https://youtube.com/watch?v=..."
            helperText="Link to video content (YouTube, Vimeo, etc.)"
          />
          <TextField
            fullWidth
            label="Duration"
            value={lessonForm.duration}
            onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
            margin="normal"
            placeholder="e.g., 15 min, 1 hour"
            helperText="Estimated time to complete this lesson"
          />
          <TextField
            fullWidth
            label="Lesson Content"
            value={lessonForm.content}
            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
            margin="normal"
            multiline
            rows={6}
            placeholder="Detailed lesson content, notes, or transcript..."
            helperText="Text content, code snippets, or additional resources"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenLessonDialog(false);
            setEditingLesson(null);
            setSelectedSectionId(null);
            setLessonForm({ title: '', description: '', content: '', video_url: '', duration: '', order: 0 });
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={editingLesson ? handleUpdateLesson : handleAddLesson}
          >
            {editingLesson ? 'Update' : 'Add'} Lesson
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog 
        open={openQuizDialog} 
        onClose={() => setOpenQuizDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quiz Title"
            value={quizForm.title}
            onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., Module 1 Assessment"
            autoFocus
          />
          <TextField
            fullWidth
            label="Description"
            value={quizForm.description}
            onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Brief description of the quiz"
          />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={quizForm.duration_minutes}
                onChange={(e) => setQuizForm({ ...quizForm, duration_minutes: parseInt(e.target.value) })}
                placeholder="30"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Passing Score (%)"
                type="number"
                value={quizForm.passing_score}
                onChange={(e) => setQuizForm({ ...quizForm, passing_score: parseInt(e.target.value) })}
                placeholder="70"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Attempts (optional)"
                type="number"
                value={quizForm.max_attempts || ''}
                onChange={(e) => setQuizForm({ ...quizForm, max_attempts: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Leave empty for unlimited"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={quizForm.published}
                    onChange={(e) => setQuizForm({ ...quizForm, published: e.target.checked })}
                  />
                }
                label="Published"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Add Questions
          </Typography>
          
          <TextField
            fullWidth
            label="Question"
            value={currentQuestion.question_text}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Enter your question here..."
          />
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Points"
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                placeholder="1"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={currentQuestion.question_type}
                  label="Question Type"
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_type: e.target.value })}
                >
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="true_false">True/False</MenuItem>
                  <MenuItem value="short_answer">Short Answer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Answer Options
          </Typography>
          
          {currentQuestion.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option.option_text}
                onChange={(e) => handleUpdateQuestionOption(index, 'option_text', e.target.value)}
                placeholder="Enter answer option"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.is_correct}
                    onChange={(e) => handleUpdateQuestionOption(index, 'is_correct', e.target.checked)}
                  />
                }
                label="Correct"
              />
              {currentQuestion.options.length > 2 && (
                <IconButton onClick={() => handleRemoveQuestionOption(index)} color="error">
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          
          <Button
            startIcon={<Add />}
            onClick={handleAddQuestionOption}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>

          <TextField
            fullWidth
            label="Explanation (optional)"
            value={currentQuestion.explanation}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Explain why this is the correct answer..."
          />

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddQuestionToQuiz}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Question to Quiz
          </Button>

          {quizForm.questions.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Questions ({quizForm.questions.length})
              </Typography>
              <List>
                {quizForm.questions.map((q, index) => (
                  <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <ListItemText
                      primary={`Q${index + 1}: ${q.question_text}`}
                      secondary={`${q.options.length} options • ${q.points} point(s)`}
                    />
                    <IconButton onClick={() => handleRemoveQuestionFromQuiz(index)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenQuizDialog(false);
            setEditingQuiz(null);
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveQuiz}
            disabled={!quizForm.title || quizForm.questions.length === 0}
          >
            {editingQuiz ? 'Update' : 'Create'} Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
