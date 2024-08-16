export function convertToLocalTime(utcDateString:string) {
    // 创建日期对象
    const utcDate = new Date(utcDateString);
    
    // 获取当地时间的年份、月份、日期、小时和分钟
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0'); // 月份是0基的，要加1
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');

    // 格式化返回当地时间
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
