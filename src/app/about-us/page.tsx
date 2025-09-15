import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Users } from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    { 
      name: "Mohammad Almaaita", 
      role: "ENG", 
      image: "https://c.top4top.io/p_3458pjgp62.jpg" 
    },
    { 
      name: "Zead Shalash", 
      role: "ENG", 
      image: "https://d.top4top.io/p_3458i17ri3.jpg" 
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
            <Users /> About Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Building /> Project idea
            </h2>
            <p className="text-lg text-muted-foreground">
              This project was developed to introduce new ideas to the world.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">The Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardContent className="p-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage 
                        src={member.image} 
                        alt={`${member.name} profile picture`} 
                      />
                      <AvatarFallback>
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-medium">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
