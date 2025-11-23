import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Timer,
  CheckCircle,
  Cancel,
  ArrowBack,
  ArrowForward,
  Send,
} from '@mui/icons-material';
import api from '../api';

export default function QuizTakingPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetchQuiz();
    fetchAttempts();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/api/quizzes/${quizId}`);
      setQuiz(response.data);
      
      // Start attempt
      const attemptResponse = await api.post(`/api/quizzes/${quizId}/start`);
      setAttemptId(attemptResponse.data.attempt_id);
      
      // Set timer if quiz has duration
      if (response.data.duration_minutes) {
        setTimeLeft(response.data.duration_minutes * 60);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await api.get(`/api/quizzes/${quizId}/attempts`);
      setAttempts(response.data.attempts || []);
    } catch (err) {
      console.error('Failed to fetch attempts', err);
    }
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const handleSubmitQuiz = async () => {
    if (submitted) return;
    
    setSubmitted(true);
    setShowSubmitDialog(false);
    
    try {
      const submission = {
        answers: quiz.questions.map(q => ({
          question_id: q.id,
          selected_option_id: answers[q.id] || null
        }))
      };

      const response = await api.post(`/api/quizzes/${quizId}/submit`, submission);
      setResults(response.data);
    } catch (err) {
      setError('Failed to submit quiz');
      setSubmitted(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / quiz.questions.length) * 100;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (submitted && results) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {results.passed ? (
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            ) : (
              <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            )}
            <Typography variant="h4" gutterBottom>
              {results.passed ? 'Congratulations!' : 'Keep Trying!'}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You scored {results.score.toFixed(1)}%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {results.passed ? 'You passed the quiz!' : `You need ${quiz.passing_score}% to pass.`}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quiz Results
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Points Earned:</Typography>
              <Typography fontWeight="bold">
                {results.earned_points} / {results.total_points}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Score:</Typography>
              <Typography fontWeight="bold">{results.score.toFixed(1)}%</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Time Taken:</Typography>
              <Typography fontWeight="bold">
                {Math.floor(results.time_taken_seconds / 60)} minutes {results.time_taken_seconds % 60} seconds
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
            >
              Back to Course
            </Button>
            {quiz.max_attempts === null || attempts.length < quiz.max_attempts ? (
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
              >
                Retake Quiz
              </Button>
            ) : null}
          </Box>
        </Paper>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">{quiz.title}</Typography>
            {timeLeft !== null && (
              <Chip
                icon={<Timer />}
                label={formatTime(timeLeft)}
                color={timeLeft < 300 ? 'error' : 'primary'}
                sx={{ fontSize: '1.1rem', py: 2.5 }}
              />
            )}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {answeredCount} answered
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getProgressPercentage()} 
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        </Box>

        {/* Question */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question_text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
            </Typography>
            
            <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={option.option_text}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      p: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <Typography variant="body2" color="text.secondary">
            {answeredCount}/{quiz.questions.length} questions answered
          </Typography>

          {isLastQuestion ? (
            <Button
              variant="contained"
              endIcon={<Send />}
              onClick={() => setShowSubmitDialog(true)}
              disabled={answeredCount !== quiz.questions.length}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit? You have answered {answeredCount} out of {quiz.questions.length} questions.
          </Typography>
          {answeredCount < quiz.questions.length && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You haven't answered all questions. Unanswered questions will be marked as incorrect.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitQuiz}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
