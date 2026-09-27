print("CourseHub - Buoi 1")
students = [
    {"id": "22000001", "name": "Nguyen Minh Anh", "major": "KHDL"},
    {"id": "22000002", "name": "Tran Duc Long", "major": "KHDL"},
]
courses = [
    {
        "code": "INT2204",
        "name": "Co so du lieu Web va he thong thong tin",
        "capacity": 3,
        "enrolled": 2,
    },
    {
        "code": "INT2205",
        "name": "Khai pha du lieu",
        "capacity": 2,
        "enrolled": 2,
    },
]
enrollments = [
    {"student_id": "22000001", "course_code": "INT2204"}
]


def find_course(course_code):
    for course in courses:
        if course["code"] == course_code:
            return course
    return None

def can_enroll(student_id, course_code):
    course = find_course(course_code)
    if course is None:
        return False, "Hoc phan khong ton tai"
    if course["enrolled"] >= course["capacity"]:
        return False, "Lop da du so luong"
    duplicated = any(
        item["student_id"] == student_id and item["course_code"] == course_code for item in enrollments
        )
    if duplicated:
        return False, "Sinh vien da dang ky hoc phan nay"
    return True, "Co the dang ky"

def search_courses(keyword):
    normalized = keyword.strip().lower()
    results = []
    for course in courses:
        code = course["code"].lower()
        name = course["name"].lower()
        if normalized in code or normalized in name:
            results.append(course)
    return results

def enroll_student(student_id, course_code):
    student_exist = False
    for i in students:
        if i["id"] == student_id:
            student_exist = True
            break
    if not student_exist:
        print("sinh vien khong ton tai")
        return
    
    flag, status = can_enroll(student_id, course_code)
    if flag == True:
        enrollments.append({"student_id": student_id, "course_code": course_code})
        for i in courses:
            if i["code"] == course_code:
                i["enrolled"] += 1
                print("Dang ky thanh cong")
                return
    else:
        print(status)
        return

enroll_student("22000001", "INT2204")
enroll_student("22000002", "INT2204")
enroll_student("22000002", "INT2205")
enroll_student("22000002", "INT2206")
enroll_student("22000003", "INT2204")