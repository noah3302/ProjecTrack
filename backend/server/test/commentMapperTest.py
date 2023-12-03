import unittest
from server.mapper.CommentMapper import CommentMapper
from server.bo.Comment import Comment

class TestCommentMapper(unittest.TestCase):
    def test_find_all(self):
        with CommentMapper() as mapper:
            comments = mapper.find_all()
            self.assertTrue(isinstance(comments, list))

    def test_find_by_key(self):
        with CommentMapper() as mapper:
            # Assuming comment_id 2 exists in your test database
            comment = mapper.find_by_key(2)
            self.assertIsInstance(comment, Comment)

    def test_insert_update_delete(self):
        with CommentMapper() as mapper:
            # Insert a new comment
            new_comment = Comment()
            new_comment.set_comment("Test Comment")
            new_comment.set_erstellungsdatum("2023-01-01 12:00:00")
            new_comment.set_user_id(1)
            new_comment.set_task_id(1)

            inserted_comment = mapper.insert(new_comment)
            self.assertIsInstance(inserted_comment, Comment)

            # Update the inserted comment
            inserted_comment.set_comment("Updated Test Comment")
            mapper.update(inserted_comment)

           
