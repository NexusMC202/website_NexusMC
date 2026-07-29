"use client";
import { useEffect } from "react";

const dictionary: Record<string,string> = {
  "Мир":"World","Государства":"Nations","Хроника":"Chronicle","Авторы":"Creators","ВОЙТИ ↗":"SIGN IN ↗",
  "ОДНО ЯДРО.":"ONE CORE.","БЕСКОНЕЧНЫЕ ВОЗМОЖНОСТИ.":"INFINITE POSSIBILITIES.","ПРИСОЕДИНИТЬСЯ ↗":"JOIN ↗","ИССЛЕДОВАТЬ МИР →":"EXPLORE THE WORLD →",
  "ЗДЕСЬ":"HERE","ПИШУТ ИГРОКИ.":"IS WRITTEN BY PLAYERS.","Исследуй":"Explore","Создавай":"Create","Объединяйся":"Unite",
  "СЕВЕРНАЯ":"NORTHERN","ДОЛИНА":"VALLEY","НАЙДИ СВОЁ МЕСТО":"FIND YOUR PLACE","ЛАНДШАФТЫ":"LANDSCAPES",
  "ГОРОДА":"CITIES","Здесь появятся настоящие государства, поселения и кланы игроков второго сезона.":"Real states, settlements and clans created by Season II players will appear here.",
  "ОСНОВАТЬ СВОЙ ГОРОД ↗":"FOUND YOUR CITY ↗","ПОКА НОВОСТЕЙ НЕТ":"NO NEWS YET","ХРОНИКА ЖДЁТ ВАС":"THE CHRONICLE AWAITS YOU",
  "НОВОСТЕЙ ПОКА НЕТ.":"NO NEWS YET.","СОЗДАТЬ ПЕРВОЕ СОБЫТИЕ ↗":"CREATE THE FIRST EVENT ↗",
  "ЛЮДИ,":"PEOPLE WHO","МИР":"THE WORLD","ОСНОВАТЕЛЬ":"FOUNDER","СО-ОСНОВАТЕЛЬ":"CO-FOUNDER","МОДОДЕЛ":"MOD DEVELOPER",
  "СПОНСОР · ИНВЕСТОР":"SPONSOR · INVESTOR","ГЛАВНЫЙ АДМИНИСТРАТОР":"HEAD ADMINISTRATOR","ГЛАВНЫЙ МОДЕРАТОР":"HEAD MODERATOR",
  "ВЕРНУТЬСЯ В NEXUS":"BACK TO NEXUS","Уже играете на сервере?":"Already play on the server?","Ещё не играете, но вам интересно?":"New to Nexus and interested?",
  "ВХОД":"SIGN IN","РЕГИСТРАЦИЯ":"REGISTER","ЭЛЕКТРОННАЯ ПОЧТА":"EMAIL","ПАРОЛЬ":"PASSWORD","НИК В MINECRAFT":"MINECRAFT NICKNAME",
  "ВОЙТИ В NEXUS":"SIGN IN TO NEXUS","СОЗДАТЬ АККАУНТ":"CREATE ACCOUNT"
  ,"мир":"world","мира":"world","СЕРВЕР В СЕТИ":"SERVER ONLINE","ОТКРЫТЬ ↗":"OPEN ↗","ГОЛОСА":"VOICES","ПРОЕКТ":"PROJECT"
  ,"Наука строит цивилизации. Магия переписывает законы. Союзы и конфликты превращаются в историю, которая остаётся после вас.":"Science builds civilizations. Magic rewrites laws. Alliances and conflicts become a history that remains after you."
  ,"ВЫЙТИ":"GO","ЗА ГРАНИЦЫ":"BEYOND THE BORDER","ОТКРЫТЬ АТЛАС ↗":"OPEN THE ATLAS ↗","УНИКАЛЬНЫХ":"UNIQUE","РЕГИОНОВ":"REGIONS"
  ,"ИСТОРИИ":"STORIES","СООБЩЕСТВА":"OF THE COMMUNITY","Наведи на лист и выбери автора. Лучшие ролики, стримы и хроники игроков живут здесь.":"Hover over a sheet and choose a creator. The best videos, streams and player chronicles live here."
  ,"ЖДЁТ ВАС":"AWAITS YOU","Но первая новость уже может начаться с вашего решения. Играйте, исследуйте, основывайте города — и события сервера появятся здесь.":"The first story may begin with your decision. Play, explore and found cities — server events will appear here."
  ,"ВОЙТИ В ИСТОРИЮ ↗":"ENTER THE STORY ↗","КАК ЭТО БУДЕТ ВЫГЛЯДЕТЬ":"WHAT IT WILL LOOK LIKE","Примеры, не реальные события":"Examples, not real events"
  ,"Высокие хвойные леса, отвесные стены и долины, которых ещё нет на картах.":"Tall conifer forests, sheer cliffs and valleys not yet shown on maps."
  ,"Проведи по карточкам →":"Explore the cards →","ИССЛЕДОВАТЬ ↗":"EXPLORE ↗","МИР НЕ ДЕКОРАЦИЯ.":"THE WORLD IS NOT A SET.","ОН — УЧАСТНИК ИСТОРИИ.":"IT IS PART OF THE STORY."
  ,"Каждый регион создаёт собственные маршруты, ресурсы, опасности и причины для войны.":"Every region creates its own routes, resources, dangers and reasons for war."
  ,"АРХИТЕКТУРА":"ARCHITECTURE","ВАЖНО":"IMPORTANT","КОНЦЕПТ · НЕ ИГРОВОЙ ГОРОД":"CONCEPT · NOT AN IN-GAME CITY"
  ,"Эти изображения используются только как визуальные референсы. На них не показаны настоящие города сервера NexusMC. Изображения не принадлежат NexusMC или Flux Production, и проект не заявляет авторских прав на них.":"These images are visual references only. They do not show real NexusMC cities. The images do not belong to NexusMC or Flux Production, and the project claims no copyright to them."
  ,"И это нормально: второй сезон ещё не написал свою историю. Создавайте государства, находите технологии, заключайте союзы и начинайте конфликты — значимые события попадут в официальную хронику.":"That is expected: Season II has not written its history yet. Build nations, discover technologies, make alliances and start conflicts — important events will enter the official chronicle."
  ,"Команда, которая строит сервер, код, правила и пространство для историй игроков.":"The team building the server, its code, rules and a place for player stories."
  ,"ПРЯМОЙ":"LIVE","ЭФИР":"STREAM","ЗРИТЕЛЕЙ":"VIEWERS","СЕЙЧАС":"NOW","Ожидаем первый эфир":"Waiting for the first live stream"
  ,"Для настоящего live‑статуса потребуется подключить официальный Twitch API.":"The official Twitch API must be connected for real live status.","ПОДКЛЮЧИТЬ КАНАЛ ↗":"CONNECT A CHANNEL ↗"
  ,"СМОТРИ":"WATCH","КАНАЛЫ ЕЩЁ":"CHANNELS ARE","НЕ ДОБАВЛЕНЫ.":"NOT ADDED YET.","ДОБАВИТЬ СВОЙ КАНАЛ ↗":"ADD YOUR CHANNEL ↗"
  ,"АРХИВ":"ARCHIVE","Архив ждёт первую запись":"The archive awaits its first recording","ПРЕДЛОЖИТЬ ВИДЕО ↗":"SUBMIT A VIDEO ↗"
  ,"ТВОЙ":"YOUR","ГОЛОС":"VOICE","ИМЯ ИЛИ НИК":"NAME OR NICKNAME","ССЫЛКА НА КАНАЛ":"CHANNEL URL","ПЛАТФОРМА":"PLATFORM","РАССКАЖИТЕ О КАНАЛЕ":"TELL US ABOUT YOUR CHANNEL"
  ,"Тогда войдите в существующий аккаунт.":"Sign in to your existing account.","Создайте аккаунт и познакомьтесь с Nexus.":"Create an account and discover Nexus.","Сессия действует два следующих входа на сайт. После этого потребуется снова указать пароль.":"The session allows two further visits. After that you will need to enter your password again."
};

export function LanguageRuntime() {
  useEffect(() => {
    if (!sessionStorage.getItem("nexus-session-counted")) {
      fetch("/api/auth/session", { method:"POST" }).finally(() => sessionStorage.setItem("nexus-session-counted", "1"));
    }
    const originals = new WeakMap<Text,string>();
    const apply = (lang:string) => {
      document.documentElement.lang = lang;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node as Text;
        if (!originals.has(text)) originals.set(text, text.data);
        const original = originals.get(text)!;
        const trimmed = original.trim();
        if (lang === "en" && dictionary[trimmed]) text.data = original.replace(trimmed, dictionary[trimmed]);
        if (lang === "ru") text.data = original;
      }
    };
    const onLanguage = (event: Event) => apply((event as CustomEvent<string>).detail);
    window.addEventListener("nexus-language", onLanguage);
    apply(localStorage.getItem("nexus-language") ?? "ru");
    return () => window.removeEventListener("nexus-language", onLanguage);
  }, []);
  return null;
}
