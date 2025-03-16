import mongoose from "mongoose"
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      },
      likes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          }
        }
      ],
      replies: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          },
          text: {
            type: String,
            required: true
          },
          name: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('post', PostSchema);

export default Post