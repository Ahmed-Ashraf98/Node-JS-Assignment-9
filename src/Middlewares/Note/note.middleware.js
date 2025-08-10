import { NoteModal } from "../../DB/Models/note.model.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";

export const validateNote = async (req, res, next) => {
  try {
    const noteID = req.params.noteId;
    const note = await NoteModal.findById(noteID);
    if (!note) {
      return responseHandler(
        res,
        "Note Id does not exist",
        httpStatus.NOT_FOUND
      );
    }
    req.noteRecord = note;
    next();
  } catch (error) {
    console.error("Error in validateNote middleware:", error);
    return responseHandler(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const validateOwner = async (req, res, next) => {
  try {
    const userId = req.tokenObj.userId;
    const noteId = req.params.noteId || req.params.id;
    const noteObj = await NoteModal.findOne({ _id: noteId, userId });

    if (!noteObj) {
      return responseHandler(
        res,
        "You are not the owner of the Note",
        httpStatus.FORBIDDEN
      );
    }

    req.noteRecord = noteObj;
    next();
  } catch (error) {
    console.error("Error in validateOwner middleware:", error);
    return responseHandler(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
