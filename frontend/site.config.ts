export const config = {
  siteMeta: {
    title: 'おまかセトリ',
    catchcopy: '楽曲リスト作成ツール',
    description:
      'おまかセトリはユーザーグループの好みを反映した楽曲リストを自動作成するWebアプリケーションです。Apple MusicやSpotifyと連携して自分のプレイリストをインポートすることができ、そのデータをもとに最適な楽曲リストを提案します。',
  },
  siteRoot:
    process.env.NODE_ENV === 'production' ? 'https://omakasetli.com' : 'http://localhost:3000',
  themeColor: '#fff',
}
