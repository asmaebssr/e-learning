import express from 'express';
import LearningPath from '../models/learningPathModel.js';

const router = express.Router();


// get a learning path by ID
router.get('/learning-paths/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const learningPath = await LearningPath.findById(id);

    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    res.status(200).json(learningPath);
  } catch (error) {
    console.error("Error fetching learning path:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new learning path
router.post('/learning-paths', async (req, res) => {
  try {
    const { category, subcategory, description, technologies } = req.body;

    // Validate required fields
    if (!category || !subcategory || !description || !technologies) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new learning path
    const newLearningPath = new LearningPath({
      category,
      subcategory,
      description,
      technologies,
    });

    // Save to the database
    await newLearningPath.save();

    res.status(201).json({ message: "Learning path created successfully", learningPath: newLearningPath });
  } catch (error) {
    console.error("Error creating learning path:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a learning path
router.put('/learning-paths/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subcategory, description, technologies } = req.body;

    const updatedPath = await LearningPath.findByIdAndUpdate(
      id,
      { category, subcategory, description, technologies },
      { new: true } // Return the updated document
    );

    if (!updatedPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    res.status(200).json(updatedPath);
  } catch (error) {
    console.error("Error updating learning path:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an existing learning path
router.delete('/learning-paths/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the learning path
    const deletedPath = await LearningPath.findByIdAndDelete(id);

    if (!deletedPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    res.status(200).json({ message: "Learning path deleted successfully", learningPath: deletedPath });
  } catch (error) {
    console.error("Error deleting learning path:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;