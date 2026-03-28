import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, trim: true },
    title: { type: String, trim: true },
    bio: { type: String },
    profileImage: { type: String }, // Cloudinary URL
    logo: { type: String }, // Cloudinary URL

    // Skills
    skills: [
      {
        name: { type: String, required: true },
        level: { type: Number, default: 80 },
        icon: { type: String }
      }
    ],

    // Experience
    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String }
      }
    ],

    // Education
    education: [
      {
        degree: { type: String, required: true },
        school: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String }
      }
    ],

    // Projects
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        techStack: [String],
        images: [String],
        githubLink: { type: String },
        liveLink: { type: String },
        featured: { type: Boolean, default: false }
      }
    ],

    // Contact
    contact: {
      email: { type: String },
      phone: { type: String },
      linkedin: { type: String },
      github: { type: String }
    }
  },
  {
    timestamps: true,
    collection: 'profiles'
  }
);

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
