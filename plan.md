# Plan

## Dashboard
- Show Unhandled/Handled/Total Reports
- Show Unverified/Verified/Pet Owner/Vet/Total Users

## Report
- List Unhandled Reports
- List Handled Reports
- Detailed Report View
    - Display reported post
    - Display who reported
    - Display time reported
- Handle Reports
    - Mark Report as Handled
    - Delete Post (Should Archive)

## Users
- List Unverified Users
- List All Vets
- List All Pet Owners
- Detailed User View
    - Display User Details
    - Display User Image
    - Display User Docs
- Verify Users
    - Detailed User View
    - Mark as Verified
    - Cancel

## Functions
- [x] getAllUsers()
- [x] getUserById(int: id)
- [x] getUserByVerification(bool: isVerified)
- [x] getUsersByRole(string: role)
- [x] verifyUserById(int id)
- [x] getAllReports()
- [x] getReportsByHandling(bool: isHandled)
- [x] getReportById(int: id)
- [x] handleReportById(int: id)
- [x] deletePostById(int: id)
- [x] getAllPosts()
- [x] getPostById()

# ToDo

- [X] Finish Dashboard Frontend
- [ ] Finish Report Frontend
- [ ] Finish Users Frontend
- [X] Implement Show Unhandled/Handled/Total Reports
- [X] Implement Show Unverified/Verified/Pet Owner/Vet/Total Users
- [X] Implement List Unhandled Reports
- [X] Implement List Handled Reports
- [x] Implement Detailed Report View
- [x] Implement Handle Reports
- [ ] Implement List Unverified Users
- [ ] Implement List All Vets
- [ ] Implement List All Pet Owners
- [ ] Implement Detailed User View
- [ ] Implement Verify Users
