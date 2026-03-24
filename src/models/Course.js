import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    duration: {
      type: String,
      required: [true, 'Please provide course duration'],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Please provide course level'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide course price'],
    },
    category: {
      type: String,
      required: [true, 'Please provide course category'],
    },
    image: {
      type: String,
      default: '/images/default-course.jpg',
    },
    instructor: {
      type: String,
      required: [true, 'Please provide instructor name'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    modules: [
      {
        title: String,
        description: String,
        duration: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);