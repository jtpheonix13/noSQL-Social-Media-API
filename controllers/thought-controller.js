const { User, Thought } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get single thought by id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No Thought with that ID'})
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new thought and push id to user'r thoughts array
    async createThought(req, res) {
        try{
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId},
                { $push: {thoughts: thought._id }}
            )
            res.json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // update a thought by its id
    async updateThought(req, res) {
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No Thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete thought by id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
            if (!thought) {
            res.status(404).json({ message: 'No thought exists' });
            }
    
            res.json({ message: 'Thought deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a reaction stored in a thoughts reactions array
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body }},
                { runValidators: true, new: true} 
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found'});
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a reaction by reaction id
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId }}},
                { runValidators: true, new: true}
            );

            if (!thought) {
                return res.status(404).json({ message: "No thought found"});
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};