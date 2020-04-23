class File:

    def __init__(self, file_id, name, estimated_time, filepath_stl, filepath_gcode):
        self.filepath_gcode = filepath_gcode
        self.filepath_stl = filepath_stl
        self.id = file_id
        self.name = name
        self.estimated_time = estimated_time
        pass

    def __str__(self):
        text = "\nFile " + self.name + ".gcode"
        text += "\n\tEstimated time:\t" + str(self.estimated_time) + "s"
        text += "\n\tSTL location:\t" + str(self.filepath_stl)
        text += "\n\tGCODE location:\t" + str(self.filepath_gcode)
        return text

    def jsonify(self):
        return {
            "id": self.id,
            "name": self.name,
            "estimated_time": self.estimated_time
        }
