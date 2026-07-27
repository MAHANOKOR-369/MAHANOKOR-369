using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Mahanokor369Core
{
    class AdminMatrix
    {
        static async Task Main(string[] args)
        {
            Console.Title = "MAHANOKOR 369 - SUPREME COMMAND (C# CLIENT)";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Initiating Quantum Link...");

            HttpClient client = new HttpClient();
            try
            {
                // ព្យាយាមភ្ជាប់ទៅកាន់ Python Backend របស់បង
                HttpResponseMessage response = await client.GetAsync("http://127.0.0.1:5000/");
                response.EnsureSuccessStatusCode();
                
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("[✅] C# Desktop App ទាក់ទងសេវាមេជោគជ័យ។ អំណាចគ្រប់គ្រងរួចរាល់!");
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[❌] បរាជ័យក្នុងការភ្ជាប់: " + ex.Message);
            }
            Console.ResetColor();
            Console.ReadLine();
        }
    }
}
