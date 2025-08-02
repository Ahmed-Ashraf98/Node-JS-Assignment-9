import { NoteModal } from "../../DB/Models/note.model.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";
import _ from "mongoose-paginate-v2";

// 1
export const createNote = async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.userRecord._id;

  // 1- create a new note
  const newNote = new NoteModal({
    title,
    content,
    userId,
  });

  await newNote.save();
  return responseHandler(res, "Note created", httpStatus.CREATED);
};

// 2
export const updateNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  const { title, content } = req.body;

  const updatedNote = await NoteModal.findByIdAndUpdate(
    noteId,
    { title, content, updatedAt: Date.now() },
    { new: true }
  );

  if (!updatedNote) {
    return responseHandler(res, "Note not found", httpStatus.NOT_FOUND);
  }

  return responseHandler(res, "Note updated successfully", httpStatus.OK, {
    note: updatedNote,
  });
};

// 3
export const replaceNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  const { title, content, userId } = req.body;
  const replacedNote = await NoteModal.findOneAndReplace(
    { _id: noteId },
    { title, content, userId, updatedAt: Date.now() },
    { new: true }
  );
  if (!replacedNote) {
    return responseHandler(res, "Note not found", httpStatus.NOT_FOUND);
  }
  return responseHandler(res, "Note replaced successfully", httpStatus.OK, {
    note: replacedNote,
  });
};

// 4

export const updateAllNotesTitleForUser = async (req, res, next) => {
  const userId = req.userRecord._id;
  const { title } = req.body;
  const updatedNotes = await NoteModal.updateMany(
    { userId },
    { title, updatedAt: Date.now() }
  );
  if (updatedNotes.modifiedCount === 0) {
    return responseHandler(
      res,
      "No notes found for the user",
      httpStatus.NOT_FOUND
    );
  }
  return responseHandler(res, "All notes updated successfully", httpStatus.OK);
};

// 5
export const deleteNoteById = async (req, res, next) => {
  const noteId = req.params.noteId;

  const deletedNote = await NoteModal.findByIdAndDelete(noteId);

  if (!deletedNote) {
    return responseHandler(res, "Note not found", httpStatus.NOT_FOUND);
  }

  return responseHandler(res, "Note deleted successfully", httpStatus.OK, {
    note: deletedNote,
  });
};

// 6
export const getPaginatedNotes = async (req, res, next) => {
  const userId = req.userRecord._id;
  const sortBy = "createdAt";
  const sortOrder = "desc";
  const { page = 1, limit = 10 } = req.query;

  if (isNaN(page) || isNaN(limit)) {
    next("Page and limit must be numbers");
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
  };

  const notes = await NoteModal.paginate({ userId }, options);

  return responseHandler(res, "Notes retrieved successfully", httpStatus.OK, {
    notes: notes.docs,
  });
};

// 7

export const getNoteById = async (req, res, next) => {
  const note = req.noteRecord; // from validateOwner middleware

  if (!note) {
    return responseHandler(res, "Note not found", httpStatus.NOT_FOUND);
  }

  return responseHandler(res, "Note retrieved successfully", httpStatus.OK, {
    note,
  });
};

// 8

export const getNoteByContent = async (req, res, next) => {
  const { content } = req.query;
  const userId = req.userRecord._id;
  const note = await NoteModal.findOne({ content, userId });
  if (!note) {
    return responseHandler(res, "Note not found", httpStatus.NOT_FOUND);
  }
  return responseHandler(res, "Note retrieved successfully", httpStatus.OK, {
    note,
  });
};

// 9
export const getAllNotes = async (req, res, next) => {
  const userId = req.userRecord._id;
  const notes = await NoteModal.find(
    { userId },
    { title: 1, createdAt: 1 }
  ).populate("userId", "email -_id");
  if (notes.length === 0) {
    return responseHandler(
      res,
      "No notes found for the user",
      httpStatus.NOT_FOUND
    );
  }
  return responseHandler(res, "Notes retrieved successfully", httpStatus.OK, {
    notes,
  });
};

// 10

export const getAllNotesWithAggregation = async (req, res, next) => {
  const userId = req.userRecord._id;
  const notes = await NoteModal.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: 1,
        title: 1,
        createdAt: 1,
        "user.email": 1,
        "user.name": 1,
      },
    },
  ]);
  if (notes.length === 0) {
    return responseHandler(
      res,
      "No notes found for the user",
      httpStatus.NOT_FOUND
    );
  }
  return responseHandler(res, "Notes retrieved successfully", httpStatus.OK, {
    notes,
  });
};

// 11
export const deleteAllNotesForUser = async (req, res, next) => {
  const userId = req.userRecord._id;

  const deletedNotes = await NoteModal.deleteMany({ userId });

  if (deletedNotes.deletedCount === 0) {
    return responseHandler(
      res,
      "No notes found for the user",
      httpStatus.NOT_FOUND
    );
  }

  return responseHandler(res, "All notes deleted successfully", httpStatus.OK);
};
