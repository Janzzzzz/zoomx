# ZoomX — prototip aplikacije

Cilj
- Naloži fotografijo (avatar) in jo animiraj, da izgleda, kot da poslušaš v video-klicu.
- Snemaj zvok srečanja, transkribiraj ga in avtomatsko generiraj zapiske z OpenAI.
- Omogoči avtomatsko priključevanje na sestanke preko uradne Zoom integracije (OAuth + SDK) ali preko lastnega WebRTC "virtual meeting" strežnika.

Struktura repozitorija (prototip)
- backend/ — Node.js/Express backend + Python placeholder za ML animacijo
- frontend/ — React + Vite frontend (upload avatarja, predogled, proceduralna animacija, snemalnik)

Hiter začetek (lokalno)
1. Kloniraj repozitorij in se premakni v mapo projekta.
2. Backend:
   cd backend
   npm install
   - Izpolni backend/.env.example -> .env (vsaj OPENAI_API_KEY če želiš transkripcijo)
   npm start
3. Frontend:
   cd ../frontend
   npm install
   npm run dev
4. Odpri http://localhost:5173 (privzeta Vite lokacija) in preizkusi.

Glavne funkcionalnosti (kako deluje prototip)
- Avatar upload: frontend pošlje sash file na /upload-avatar; backend shrani in vrne pot.
- Animacija: za hitro demo deluje "procedural" način (CSS/JS animacije). Če izbereš "ml" način, backend pokliče Python skripto (placeholder) ki lahko kasneje sproži težji ML pipeline.
- Snemanje: frontend začne MediaRecorder in pošlje zvočne posnetke na /transcribe; backend pokliče OpenAI ali lokalni Whisper (navodila spodaj) in vrne transkript + avtomatski povzetek.
- Zoom integracija: v README backend/zoom.md so koraki za ustvarjanje Zoom OAuth aplikacije in povezavo.

Varnost in skladnost
- Snemanje in transkripcija zahtevata izrecno soglasje udeležencev.
- Za Zoom integracijo uporabljaj uradni Zoom OAuth/SDK in spoštuj pogoje uporabe.

Kaj lahko narediš naprej
- Potisni to strukturo v vejo npr. `prototype` in odprej PR.
- Implementiraj OpenAI transkripcijo in generiranje zapiskov (API klici so označeni).
- Zamenjaj placeholder animate.py z realnim ML modelom, če imaš GPU/okolje.
