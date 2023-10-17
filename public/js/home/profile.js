app.put('/update-user-info', (req, res) => {
    const { userId, newNickname, newPassword } = req.body;
  
    const updateQuery = 'UPDATE users SET nickname=?, password=? WHERE id=?';
    db.query(updateQuery, [newNickname, newPassword, userId], (err, result) => {
      if (err) {
        console.error('MySQL error: ' + err.message);
        res.status(500).send('Error updating user information.');
      } else {
        res.status(200).send('User information updated successfully.');
      }
    });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });