import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4 text-center">Contact Us</h1>
        <p className="text-muted-foreground mb-12 text-center">Our team of precious metals specialists is ready to help.</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option>Order Inquiry</option>
                  <option>Selling to Us</option>
                  <option>IRA Setup</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea className="bg-background border-border min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full font-bold uppercase tracking-wider">Submit</Button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Get in Touch</h3>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Phone:</strong> <br/>1-800-GOLD-NOW (Toll Free)<br/>1-214-555-0192 (Local)</p>
                <p><strong>Email:</strong> <br/>support@puregoldtrading.com</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Business Hours</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between max-w-[200px]"><span>Monday - Friday:</span> <span>8am - 6pm CST</span></div>
                <div className="flex justify-between max-w-[200px]"><span>Saturday:</span> <span>9am - 1pm CST</span></div>
                <div className="flex justify-between max-w-[200px]"><span>Sunday:</span> <span>Closed</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Mailing Address</h3>
              <p className="text-muted-foreground">
                PureGold Trading LLC<br/>
                1400 Precious Metals Way, Suite 400<br/>
                Dallas, TX 75201
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
